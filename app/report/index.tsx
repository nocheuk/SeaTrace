import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { analytics } from '@/features/analytics';
import { useReportFlowStore } from '@/stores/reportFlowStore';

export default function ReportIndex() {
  const reset = useReportFlowStore((s) => s.reset);

  useEffect(() => {
    reset();
    analytics.track('report_started');
  }, [reset]);

  return <Redirect href="/report/photo" />;
}
