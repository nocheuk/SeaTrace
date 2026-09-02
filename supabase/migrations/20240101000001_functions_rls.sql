-- SeaTrace: triggers, functions, views, RLS policies

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS reports_updated_at ON public.reports;
CREATE TRIGGER reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Sync geography from lat/lng and compute display coords
CREATE OR REPLACE FUNCTION public.round_coordinate(value DOUBLE PRECISION, precision_digits INTEGER)
RETURNS DOUBLE PRECISION
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN ROUND(value::numeric, precision_digits)::double precision;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_report_geography()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  display_precision INTEGER := 3;
BEGIN
  IF NEW.sensitive_location THEN
    display_precision := 2;
  END IF;

  NEW.location := extensions.ST_SetSRID(
    extensions.ST_MakePoint(NEW.longitude, NEW.latitude), 4326
  )::extensions.geography;

  NEW.display_latitude := public.round_coordinate(NEW.latitude, display_precision);
  NEW.display_longitude := public.round_coordinate(NEW.longitude, display_precision);

  NEW.display_location := extensions.ST_SetSRID(
    extensions.ST_MakePoint(NEW.display_longitude, NEW.display_latitude), 4326
  )::extensions.geography;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reports_sync_geography ON public.reports;
CREATE TRIGGER reports_sync_geography
  BEFORE INSERT OR UPDATE OF latitude, longitude, sensitive_location ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.sync_report_geography();

-- Status history audit
CREATE OR REPLACE FUNCTION public.log_report_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.report_status_history (report_id, previous_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reports_status_history ON public.reports;
CREATE TRIGGER reports_status_history
  AFTER UPDATE OF status ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.log_report_status_change();

-- Update confirmation count and status
CREATE OR REPLACE FUNCTION public.handle_report_confirmation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  positive_count INTEGER;
  report_owner UUID;
BEGIN
  SELECT user_id INTO report_owner FROM public.reports WHERE id = NEW.report_id;

  IF report_owner = NEW.user_id THEN
    RAISE EXCEPTION 'Cannot confirm your own report';
  END IF;

  SELECT COUNT(*) INTO positive_count
  FROM public.report_confirmations
  WHERE report_id = NEW.report_id
    AND confirmation_type IN ('confirm', 'still_here');

  UPDATE public.reports
  SET confirmation_count = positive_count,
      status = CASE
        WHEN positive_count >= 3 AND status = 'unverified' THEN 'community_confirmed'::public.report_status
        ELSE status
      END
  WHERE id = NEW.report_id;

  UPDATE public.profiles
  SET confirmation_count = confirmation_count + 1
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS report_confirmations_after_insert ON public.report_confirmations;
CREATE TRIGGER report_confirmations_after_insert
  AFTER INSERT ON public.report_confirmations
  FOR EACH ROW EXECUTE FUNCTION public.handle_report_confirmation();

-- Increment contribution count on report insert
CREATE OR REPLACE FUNCTION public.handle_new_report()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET contribution_count = contribution_count + 1
  WHERE id = NEW.user_id;

  INSERT INTO public.user_reputation_events (user_id, event_type, points, reference_id, reference_type)
  VALUES (NEW.user_id, 'report_submitted', 1.0, NEW.id, 'report');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reports_after_insert ON public.reports;
CREATE TRIGGER reports_after_insert
  AFTER INSERT ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_report();

-- Public view (no precise coords, no user_id)
CREATE OR REPLACE VIEW public.reports_public AS
SELECT
  r.id,
  r.category,
  r.subcategory,
  r.title,
  r.description,
  r.display_latitude,
  r.display_longitude,
  r.location_accuracy,
  r.observed_at,
  r.created_at,
  r.updated_at,
  r.status,
  r.severity,
  r.species_name,
  r.species_confidence,
  r.quantity_estimate,
  r.alive_status,
  r.verification_score,
  r.confirmation_count,
  r.sensitive_location,
  r.moderation_status,
  r.source,
  r.event_id,
  r.metadata,
  (
    SELECT rm.storage_path
    FROM public.report_media rm
    WHERE rm.report_id = r.id
    ORDER BY rm.sort_order ASC
    LIMIT 1
  ) AS primary_image_path,
  p.display_name AS reporter_display_name
FROM public.reports r
LEFT JOIN public.profiles p ON p.id = r.user_id
WHERE r.moderation_status = 'approved';

-- Viewport query function
CREATE OR REPLACE FUNCTION public.reports_in_viewport(
  min_lat DOUBLE PRECISION,
  min_lng DOUBLE PRECISION,
  max_lat DOUBLE PRECISION,
  max_lng DOUBLE PRECISION,
  filter_group TEXT DEFAULT NULL,
  verified_only BOOLEAN DEFAULT FALSE,
  since TIMESTAMPTZ DEFAULT NULL
)
RETURNS SETOF public.reports_public
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT rp.*
  FROM public.reports_public rp
  WHERE rp.display_latitude BETWEEN min_lat AND max_lat
    AND rp.display_longitude BETWEEN min_lng AND max_lng
    AND (filter_group IS NULL OR filter_group = 'all' OR rp.category = filter_group)
    AND (NOT verified_only OR rp.status IN ('verified', 'community_confirmed'))
    AND (since IS NULL OR rp.observed_at >= since)
  ORDER BY rp.observed_at DESC
  LIMIT 500;
$$;

-- Nearby reports function
CREATE OR REPLACE FUNCTION public.nearby_reports(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 10,
  limit_count INTEGER DEFAULT 50
)
RETURNS SETOF public.reports_public
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT rp.*
  FROM public.reports_public rp
  JOIN public.reports r ON r.id = rp.id
  WHERE extensions.ST_DWithin(
    r.display_location,
    extensions.ST_SetSRID(extensions.ST_MakePoint(lng, lat), 4326)::extensions.geography,
    radius_km * 1000
  )
  ORDER BY r.observed_at DESC
  LIMIT limit_count;
$$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reputation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisation_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Reports policies
CREATE POLICY "Approved reports viewable via public view"
  ON public.reports FOR SELECT
  USING (
    moderation_status = 'approved'
    OR auth.uid() = user_id
  );

CREATE POLICY "Authenticated users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON public.reports FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Report media policies
CREATE POLICY "Report media viewable for approved reports"
  ON public.report_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.reports r
      WHERE r.id = report_id
        AND (r.moderation_status = 'approved' OR r.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert media for own reports"
  ON public.report_media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reports r
      WHERE r.id = report_id AND r.user_id = auth.uid()
    )
  );

-- Confirmations policies
CREATE POLICY "Confirmations viewable by authenticated users"
  ON public.report_confirmations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can confirm reports"
  ON public.report_confirmations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.reports r
      WHERE r.id = report_id AND r.user_id = auth.uid()
    )
  );

-- Saved reports policies
CREATE POLICY "Users manage own saved reports"
  ON public.saved_reports FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Reputation events - own only
CREATE POLICY "Users view own reputation events"
  ON public.user_reputation_events FOR SELECT
  USING (auth.uid() = user_id);

-- Species - public read
CREATE POLICY "Species publicly readable"
  ON public.species FOR SELECT
  USING (true);

-- Events - public read
CREATE POLICY "Events publicly readable"
  ON public.events FOR SELECT
  USING (true);

-- Event reports - public read
CREATE POLICY "Event reports publicly readable"
  ON public.event_reports FOR SELECT
  USING (true);

-- Report flags
CREATE POLICY "Users can flag reports"
  ON public.report_flags FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own flags"
  ON public.report_flags FOR SELECT
  USING (auth.uid() = user_id);

-- Status history - report owners and authenticated
CREATE POLICY "Status history for report owners"
  ON public.report_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.reports r
      WHERE r.id = report_id AND r.user_id = auth.uid()
    )
  );

-- Analytics - insert only for authenticated
CREATE POLICY "Authenticated users can log analytics"
  ON public.analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.reports_in_viewport TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.nearby_reports TO anon, authenticated;
