type AnalyticsEvent =
  | 'app_opened'
  | 'map_viewed'
  | 'report_started'
  | 'photo_added'
  | 'category_selected'
  | 'report_submitted'
  | 'report_failed'
  | 'report_viewed'
  | 'report_confirmed'
  | 'report_saved'
  | 'signup_completed';

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

type AnalyticsProvider = {
  track: (event: AnalyticsEvent, properties?: AnalyticsProperties) => void;
};

const consoleProvider: AnalyticsProvider = {
  track: (event, properties) => {
    if (__DEV__) {
      console.log(`[analytics] ${event}`, properties ?? {});
    }
  },
};

let provider: AnalyticsProvider = consoleProvider;

export const analytics = {
  setProvider: (p: AnalyticsProvider) => {
    provider = p;
  },
  track: (event: AnalyticsEvent, properties?: AnalyticsProperties) => {
    provider.track(event, properties);
  },
};

export type { AnalyticsEvent, AnalyticsProperties };
