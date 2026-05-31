/**
 * CivicWave design system — clean, trustworthy, government-grade light theme.
 * All user-facing copy in the app is Azerbaijani.
 */

export const Palette = {
  // Surfaces
  bg: '#F3F6FC',
  bgDeep: '#E9EFF9',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF3FB',
  border: '#E3E9F2',
  borderStrong: '#D2DBE8',

  // Text
  text: '#0B1524',
  textMuted: '#5C6B82',
  textFaint: '#94A3B8',
  onPrimary: '#FFFFFF',

  // Brand
  primary: '#1E6BF1',
  primaryDark: '#1450C4',
  primarySoft: '#E6EEFE',

  // AI accent (smart/vision)
  ai1: '#6D5DF6',
  ai2: '#21B5E6',

  // Severity
  low: '#16A34A',
  lowSoft: '#DCFCE7',
  medium: '#F59E0B',
  mediumSoft: '#FEF3C7',
  critical: '#DC2626',
  criticalSoft: '#FEE2E2',

  // Misc accents
  shadow: 'rgba(15, 33, 65, 0.10)',
} as const;

export const Gradients = {
  brand: ['#2D7BFF', '#1450C4'] as const,
  ai: ['#6D5DF6', '#21B5E6'] as const,
  hero: ['#1E6BF1', '#21B5E6'] as const,
  splash: ['#1E6BF1', '#1450C4'] as const,
  map: ['#DDE9FB', '#EAF1FC'] as const,
};

export const Radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const Space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const Shadow = {
  card: {
    boxShadow: '0 6px 20px rgba(15, 33, 65, 0.08)',
  },
  soft: {
    boxShadow: '0 2px 10px rgba(15, 33, 65, 0.06)',
  },
  raised: {
    boxShadow: '0 12px 30px rgba(15, 33, 65, 0.16)',
  },
} as const;

export const Type = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: '800' as const, letterSpacing: -0.5 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '800' as const, letterSpacing: -0.3 },
  h2: { fontSize: 19, lineHeight: 25, fontWeight: '700' as const, letterSpacing: -0.2 },
  h3: { fontSize: 16, lineHeight: 22, fontWeight: '700' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '500' as const },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '700' as const },
  small: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  tiny: { fontSize: 11, lineHeight: 15, fontWeight: '700' as const, letterSpacing: 0.3 },
} as const;
