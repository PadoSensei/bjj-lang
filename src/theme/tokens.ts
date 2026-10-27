export const colors = {
  // Backgrounds & Surfaces
  background: '#0F172A', // Dark slate background
  surface: '#1E293B',    // Card / surface background
  surfaceHover: '#334155',
  surfaceBorder: '#334155',

  // Typography
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',

  // Brand / Semantic
  primary: '#38BDF8',     // Sky blue accent
  primaryPressed: '#0284C7',
  secondary: '#818CF8',   // Indigo accent
  secondaryPressed: '#4F46E5',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',

  // Belt Tokens (Milestones / Progression)
  belts: {
    white: {
      belt: '#F8FAFC',
      border: '#CBD5E1',
      text: '#0F172A',
      label: 'White Belt',
    },
    blue: {
      belt: '#2563EB',
      border: '#1D4ED8',
      text: '#FFFFFF',
      label: 'Blue Belt',
    },
    purple: {
      belt: '#7C3AED',
      border: '#6D28D9',
      text: '#FFFFFF',
      label: 'Purple Belt',
    },
    brown: {
      belt: '#92400E',
      border: '#78350F',
      text: '#FFFFFF',
      label: 'Brown Belt',
    },
    black: {
      belt: '#18181B',
      border: '#27272A',
      text: '#FFFFFF',
      label: 'Black Belt',
    },
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 30,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const theme = {
  colors,
  spacing,
  radii,
  typography,
} as const;

export type BeltType = keyof typeof colors.belts;
