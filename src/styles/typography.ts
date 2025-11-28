/**
 * Typography System
 * 
 * Central typography definitions matching Figma design system
 * Font: Nunito (Google Fonts)
 * 
 * Setup Required:
 * - For Expo: expo install expo-font @expo-google-fonts/nunito
 * - For bare React Native: Link fonts manually
 */

import { TextStyle } from 'react-native';

// ============================================================================
// FONT FAMILIES
// ============================================================================

/**
 * Font family names for React Native
 * Note: Font names differ between iOS/Android/Web
 */
export const FONT_FAMILIES = {
  nunito: {
    regular: 'Nunito-Regular',
    medium: 'Nunito-Medium',
    semiBold: 'Nunito-SemiBold',
    bold: 'Nunito-Bold',
    extraBold: 'Nunito-ExtraBold',
  },
} as const;

// ============================================================================
// FONT WEIGHTS
// ============================================================================

export const FONT_WEIGHTS = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extraBold: '800' as TextStyle['fontWeight'],
} as const;

// ============================================================================
// FONT SIZES
// ============================================================================

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
} as const;

// ============================================================================
// LINE HEIGHTS
// ============================================================================

export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

// ============================================================================
// TYPOGRAPHY PRESETS
// ============================================================================

export const TYPOGRAPHY = {
  // Headings
  h1: {
    fontFamily: FONT_FAMILIES.nunito.bold,
    fontSize: FONT_SIZES['4xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES['4xl'] * LINE_HEIGHTS.tight,
  },
  h2: {
    fontFamily: FONT_FAMILIES.nunito.bold,
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES['3xl'] * LINE_HEIGHTS.tight,
  },
  h3: {
    fontFamily: FONT_FAMILIES.nunito.bold,
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES['2xl'] * LINE_HEIGHTS.tight,
  },
  
  // Body text
  body: {
    fontFamily: FONT_FAMILIES.nunito.regular,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.base * LINE_HEIGHTS.normal,
  },
  bodyLarge: {
    fontFamily: FONT_FAMILIES.nunito.regular,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.lg * LINE_HEIGHTS.normal,
  },
  bodySmall: {
    fontFamily: FONT_FAMILIES.nunito.regular,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.normal,
  },
  
  // Button text (Figma spec: Nunito Bold 20px)
  button: {
    fontFamily: FONT_FAMILIES.nunito.bold,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES.xl * LINE_HEIGHTS.normal,
  },
  
  // Labels
  label: {
    fontFamily: FONT_FAMILIES.nunito.bold,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.normal,
  },
  
  // Caption
  caption: {
    fontFamily: FONT_FAMILIES.nunito.regular,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.xs * LINE_HEIGHTS.normal,
  },
} as const;

export type TypographyVariant = keyof typeof TYPOGRAPHY;

