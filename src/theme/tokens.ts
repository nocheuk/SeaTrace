export const palette = {
  deepOcean: '#073B4C',
  ocean: '#087E8B',
  aqua: '#21B6A8',
  seaFoam: '#DDF4EF',
  sand: '#F5F1E8',
  white: '#FFFFFF',
  darkText: '#102A2E',
  warning: '#F59E0B',
  critical: '#DC4545',
  success: '#059669',
  muted: '#6B8A90',
  border: '#C5DDD8',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  hero: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const },
  subtitle: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  label: { fontSize: 14, lineHeight: 18, fontWeight: '600' as const },
} as const;

export const shadows = {
  card: {
    shadowColor: palette.deepOcean,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: palette.deepOcean,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export type ColorScheme = 'light' | 'dark';

export const lightTheme = {
  colors: {
    background: palette.sand,
    surface: palette.white,
    surfaceSecondary: palette.seaFoam,
    primary: palette.ocean,
    primaryDark: palette.deepOcean,
    accent: palette.aqua,
    text: palette.darkText,
    textSecondary: palette.muted,
    textInverse: palette.white,
    border: palette.border,
    warning: palette.warning,
    critical: palette.critical,
    success: palette.success,
    tabBar: palette.white,
    tabBarBorder: palette.border,
    reportFab: palette.aqua,
  },
  spacing,
  radii,
  typography,
  shadows,
} as const;

export const darkTheme = {
  ...lightTheme,
  colors: {
    background: '#0A1F24',
    surface: '#102A2E',
    surfaceSecondary: '#153640',
    primary: palette.aqua,
    primaryDark: palette.ocean,
    accent: palette.aqua,
    text: palette.seaFoam,
    textSecondary: '#8FB5B0',
    textInverse: palette.darkText,
    border: '#1E4349',
    warning: palette.warning,
    critical: palette.critical,
    success: palette.success,
    tabBar: '#102A2E',
    tabBarBorder: '#1E4349',
    reportFab: palette.aqua,
  },
} as const;

export type Theme = typeof lightTheme;
