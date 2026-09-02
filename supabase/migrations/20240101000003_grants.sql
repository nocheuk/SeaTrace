-- Grant view access and helper function for single report fetch

GRANT SELECT ON public.reports_public TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_report_public(report_id UUID)
RETURNS public.reports_public
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT rp.* FROM public.reports_public rp WHERE rp.id = report_id LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_report_public TO anon, authenticated;
