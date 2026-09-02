-- SeaTrace development seed data — Bournemouth & Poole coastline
-- Run after migrations. Requires at least one auth user for FK references.
-- This seed uses a fixed development user UUID for demo purposes.
-- Replace with actual user IDs after creating test accounts, or use service role.

-- Development placeholder user (create via Supabase auth first, or update IDs)
-- For local dev: sign up a user and replace this UUID in seed script.

DO $$
DECLARE
  dev_user_id UUID := '00000000-0000-4000-8000-000000000001';
BEGIN
  -- Only seed if no reports exist
  IF EXISTS (SELECT 1 FROM public.reports LIMIT 1) THEN
    RAISE NOTICE 'Reports already exist, skipping seed';
    RETURN;
  END IF;

  -- Insert dev profile if auth user exists (optional)
  INSERT INTO public.profiles (id, display_name, reputation_score)
  VALUES (dev_user_id, 'Dev Observer', 12.5)
  ON CONFLICT (id) DO NOTHING;

  -- Bournemouth Pier area reports
  INSERT INTO public.reports (
    id, user_id, category, subcategory, title, description,
    latitude, longitude, display_latitude, display_longitude,
    location, display_location, location_accuracy, observed_at,
    status, severity, species_name, confirmation_count, sensitive_location, source
  ) VALUES
  (
    '10000000-0000-4000-8000-000000000001', dev_user_id, 'wildlife', 'jellyfish',
    'Moon jellyfish bloom', 'Large number of moon jellyfish washed up along the tide line.',
    50.7158, -1.8753, 50.716, -1.875, 
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.8753, 50.7158), 4326)::extensions.geography,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.875, 50.716), 4326)::extensions.geography,
    12.0, NOW() - INTERVAL '2 hours', 'community_confirmed', 'moderate', 'Moon jellyfish', 4, false, 'seed'
  ),
  (
    '10000000-0000-4000-8000-000000000002', dev_user_id, 'pollution', 'suspected_sewage',
    'Discoloured water near groyne', 'Brown discolouration and unpleasant smell after heavy rain.',
    50.7195, -1.8820, 50.720, -1.882,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.8820, 50.7195), 4326)::extensions.geography,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.882, 50.720), 4326)::extensions.geography,
    8.0, NOW() - INTERVAL '5 hours', 'unverified', 'high', NULL, 1, false, 'seed'
  ),
  (
    '10000000-0000-4000-8000-000000000003', dev_user_id, 'debris', 'fishing_gear',
    'Abandoned fishing net', 'Large net tangled around rocks at low tide. Do not approach.',
    50.7089, -1.9012, 50.709, -1.901,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.9012, 50.7089), 4326)::extensions.geography,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.901, 50.709), 4326)::extensions.geography,
    15.0, NOW() - INTERVAL '1 day', 'verified', 'moderate', NULL, 6, false, 'seed'
  ),
  (
    '10000000-0000-4000-8000-000000000004', dev_user_id, 'wildlife', 'dead_animal',
    'Dead seabird', 'Guillemot found on beach, appears recently deceased.',
    50.7221, -1.8688, 50.722, -1.869,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.8688, 50.7221), 4326)::extensions.geography,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.869, 50.722), 4326)::extensions.geography,
    10.0, NOW() - INTERVAL '3 hours', 'unverified', 'low', 'Guillemot', 0, false, 'seed'
  ),
  (
    '10000000-0000-4000-8000-000000000005', dev_user_id, 'water', 'dead_fish',
    'Multiple dead fish', 'Approx 20 small fish washed up over 50m stretch.',
    50.7125, -1.9450, 50.713, -1.945,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.9450, 50.7125), 4326)::extensions.geography,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.945, 50.713), 4326)::extensions.geography,
    20.0, NOW() - INTERVAL '6 hours', 'community_confirmed', 'moderate', NULL, 3, false, 'seed'
  ),
  (
    '10000000-0000-4000-8000-000000000006', dev_user_id, 'coastal', 'erosion',
    'Cliff erosion observed', 'Fresh cliff fall material at base. Stay clear of cliff edge.',
    50.7350, -1.8200, 50.735, -1.820,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.8200, 50.7350), 4326)::extensions.geography,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.820, 50.735), 4326)::extensions.geography,
    25.0, NOW() - INTERVAL '2 days', 'verified', 'high', NULL, 5, false, 'seed'
  ),
  (
    '10000000-0000-4000-8000-000000000007', dev_user_id, 'wildlife', 'marine_mammal',
    'Possible seal sighting', 'Seal hauled out on sandbar. Observe from distance.',
    50.7010, -1.9650, 50.70, -1.97,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.9650, 50.7010), 4326)::extensions.geography,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.97, 50.70), 4326)::extensions.geography,
    18.0, NOW() - INTERVAL '4 hours', 'unverified', 'low', 'Grey seal', 2, true, 'seed'
  ),
  (
    '10000000-0000-4000-8000-000000000008', dev_user_id, 'other', 'unsure',
    'Unusual foam on water', 'Not sure what caused the foam patch near harbour entrance.',
    50.7280, -1.9840, 50.728, -1.984,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.9840, 50.7280), 4326)::extensions.geography,
    extensions.ST_SetSRID(extensions.ST_MakePoint(-1.984, 50.728), 4326)::extensions.geography,
    14.0, NOW() - INTERVAL '8 hours', 'unverified', NULL, 0, false, 'seed'
  );

  RAISE NOTICE 'Seed data inserted for Bournemouth/Poole development region';
END $$;
