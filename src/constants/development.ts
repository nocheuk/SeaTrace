/** Development / seed region — Bournemouth & Poole coastline (not hardcoded app boundary). */
export const DEV_REGION = {
  name: 'Bournemouth & Poole (Development)',
  center: { latitude: 50.7192, longitude: -1.8808 },
  defaultZoom: { latitudeDelta: 0.08, longitudeDelta: 0.08 },
  bounds: {
    minLat: 50.68,
    maxLat: 50.78,
    minLng: -2.05,
    maxLng: -1.72,
  },
} as const;

/** Default map centre when user location unavailable — global fallback to dev region. */
export const DEFAULT_MAP_CENTER = DEV_REGION.center;
