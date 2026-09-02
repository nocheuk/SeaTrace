import { BRAND } from './brand';

export const COPY = {
  onboarding: {
    slide1: {
      title: "See what's happening along our coast",
      body: 'Discover wildlife sightings, environmental incidents and unusual coastal events reported by the community.',
    },
    slide2: {
      title: 'Spot something? Report it.',
      body: `Take a photo and ${BRAND.name} records where and when you found it.`,
    },
    slide3: {
      title: 'Your observations matter',
      body: 'Reports can contribute to a growing dataset for coastal research and environmental monitoring.',
    },
    getStarted: 'Get started',
    skip: 'Skip',
    next: 'Next',
  },
  auth: {
    signIn: 'Sign in',
    signUp: 'Create account',
    email: 'Email',
    password: 'Password',
    displayName: 'Display name',
    magicLink: 'Send magic link',
    orContinueWith: 'Or continue with email',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
  },
  report: {
    safetyNotice:
      'Observe from a safe distance. Do not touch or disturb wildlife or hazardous material.',
    emergencyNotice: `${BRAND.name} is not an emergency service. For urgent incidents, contact the appropriate local authority.`,
    photoStep: 'Add a photo',
    locationStep: 'Confirm location',
    categoryStep: 'What did you see?',
    detailsStep: 'Add details (optional)',
    reviewStep: 'Review your report',
    submit: 'Submit report',
    successTitle: 'Thank you',
    successBody: `Your observation is now part of ${BRAND.name}.`,
    viewReport: 'View report',
    shareReport: 'Share report',
    returnToMap: 'Return to map',
    draftSaved: "Saved — we'll submit this when you're connected.",
  },
  map: {
    locationPermissionTitle: 'Location access needed',
    locationPermissionBody:
      'Allow location access to see nearby reports and pin your observations accurately.',
    enableLocation: 'Enable location',
    noReports: 'No reports in this area yet.',
    loading: 'Loading coastal reports…',
  },
  empty: {
    explore: 'No reports to show yet. Be the first to report something nearby.',
    activity: 'No recent activity yet.',
    myReports: "You haven't submitted any reports yet.",
  },
  errors: {
    generic: 'Something went wrong. Please try again.',
    offline: 'You appear to be offline.',
    uploadFailed: 'Photo upload failed. Your report has been saved as a draft.',
    locationFailed: 'Unable to get your location. You can adjust the pin manually.',
    permissionDenied: 'Permission denied.',
  },
} as const;
