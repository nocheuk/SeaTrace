import { Redirect } from 'expo-router';

/** Report tab redirects to the report flow modal stack. */
export default function ReportTabRedirect() {
  return <Redirect href="/report" />;
}
