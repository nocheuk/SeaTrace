export const featureFlags = {
  enableExploreSections: true,
  enableActivityFeed: true,
  enableAchievements: false,
  enableOrganisationAccounts: false,
  enableAiSuggestions: false,
  enableEventClustering: false,
} as const;

export type FeatureFlag = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag];
}
