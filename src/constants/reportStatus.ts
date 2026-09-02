export const REPORT_STATUSES = {
  unverified: { label: 'Unverified', color: 'muted' as const },
  community_confirmed: { label: 'Community Confirmed', color: 'aqua' as const },
  verified: { label: 'Verified', color: 'ocean' as const },
  resolved: { label: 'Resolved', color: 'success' as const },
  rejected: { label: 'Rejected', color: 'critical' as const },
} as const;

export type ReportStatus = keyof typeof REPORT_STATUSES;

export const CONFIRMATION_TYPES = {
  confirm: { label: 'I can confirm this', value: 'confirm' as const },
  still_here: { label: 'Still here', value: 'still_here' as const },
  no_longer_here: { label: 'No longer here', value: 'no_longer_here' as const },
  incorrect: { label: 'Incorrect information', value: 'incorrect' as const },
} as const;

export type ConfirmationType = (typeof CONFIRMATION_TYPES)[keyof typeof CONFIRMATION_TYPES]['value'];

export const MODERATION_STATUSES = ['pending', 'approved', 'flagged', 'removed'] as const;
export type ModerationStatus = (typeof MODERATION_STATUSES)[number];
