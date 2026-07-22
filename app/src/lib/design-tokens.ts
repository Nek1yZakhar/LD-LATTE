/**
 * LD LATTE Demo UI - Design Tokens & Visual Helpers
 * @file app/src/lib/design-tokens.ts
 * @description Programmatic design tokens, color constants, typography stacks, and styling helper functions.
 */

export const DESIGN_TOKENS = {
  brand: {
    name: 'LD LATTE',
    tagline: 'Fashion-First Influencer Discovery & Modular AI Pipeline',
    concept: 'Warm Editorial Tech',
  },
  colors: {
    bgPrimary: '#FAF8F5',
    bgSecondary: '#F4EFEA',
    bgElevated: '#FFFFFF',
    bgTertiary: '#EAE2D8',
    textPrimary: '#161210',
    textSecondary: '#4A3E39',
    textMuted: '#8C7C75',
    accentRoseGold: '#48121A', // Official LD LATTE Burgundy
    accentRoseGoldHover: '#6B1D2E',
    accentRoseGoldSubtle: '#F7EFF1',
    borderSubtle: '#E8E0D7',
    borderDefault: '#D4C4B7',
    borderStrong: '#48121A',
    status: {
      success: '#2E6B48',
      successBg: '#EAF3EC',
      warning: '#B57F22',
      warningBg: '#FAF3E6',
      error: '#A83B2B',
      errorBg: '#F9ECE9',
      info: '#4A6E8D',
      infoBg: '#EDF2F7',
    },
    charts: {
      qwenSimilarity: '#C88D74',
      featureScore: '#6E5346',
      bgeReranker: '#946955',
      vlmSanity: '#2E6B48',
    },
  },
  fonts: {
    display: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
    serif: "'Bodoni Moda', 'Playfair Display', Didot, Georgia, serif",
    body: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: {
    xs: '4px',
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(22, 18, 16, 0.04)',
    md: '0 4px 12px -2px rgba(22, 18, 16, 0.06)',
    lg: '0 12px 28px -4px rgba(22, 18, 16, 0.08)',
    accent: '0 8px 20px -4px rgba(200, 141, 116, 0.35)',
  },
} as const;

/**
 * Returns appropriate status badge styling properties based on score value (0.0 to 1.0).
 */
export function getScoreStatusTheme(score: number): {
  variant: 'success' | 'warning' | 'error';
  badgeClass: string;
  label: string;
} {
  if (score >= 0.70) {
    return {
      variant: 'success',
      badgeClass: 'ld-badge-success',
      label: 'Strong Match',
    };
  }
  if (score >= 0.50) {
    return {
      variant: 'warning',
      badgeClass: 'ld-badge-warning',
      label: 'Moderate Match',
    };
  }
  return {
    variant: 'error',
    badgeClass: 'ld-badge-error',
    label: 'Low Match',
  };
}

/**
 * Formats a decimal score into a clean percentage display (e.g. 0.7842 -> "78.4%").
 */
export function formatScorePercent(score: number): string {
  return `${(score * 100).toFixed(1)}%`;
}

/**
 * Formats raw logit score for BGE Reranker (e.g. 0.5003 -> "+0.500").
 */
export function formatRerankerLogit(score: number): string {
  const sign = score > 0 ? '+' : '';
  return `${sign}${score.toFixed(3)}`;
}
