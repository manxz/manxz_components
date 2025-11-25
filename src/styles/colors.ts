/**
 * Color System
 * 
 * Central color definitions matching Figma design system
 */

export const COLORS = {
  // Primary
  primary: '#0070f3',
  primaryPressed: '#2385f8', // Active/pressed state (when finger touches button)
  primaryDisabled: 'rgba(0, 112, 243, 0.4)',
  primarySurface: '#edf3fa', // Active input background
  
  // Positive (Success)
  positive: '#06df79',
  positivePressed: '#38e594', // Active/pressed state
  positiveDisabled: 'rgba(6, 223, 121, 0.4)',
  
  // Negative (Error/Destructive)
  negative: '#ff2600',
  negativePressed: '#ff5233', // Active/pressed state
  negativeDisabled: 'rgba(255, 38, 0, 0.4)',
  negativeSurface: '#faefed', // Error input background
  
  // Neutral
  neutral: '#1d1d1f',
  neutralPressed: '#333335', // Active/pressed state
  
  // Surfaces
  white: '#ffffff',
  whitePressed: '#f4f4f4', // Active/pressed state
  whiteDisabled: '#fafafa',
  surface: '#fafafa',
  onSurface: '#1d1d1f',
  
  // Text
  text: '#1d1d1f',
  textSecondary: '#7d7d7f',
  subtext: '#7d7d7f',
  
  // Borders
  outline: 'rgba(29, 29, 31, 0.2)',
  outlineLow: 'rgba(29, 29, 31, 0.1)',
  outlineHigh: 'rgba(29, 29, 31, 0.3)',
  
  // States
  disabled: '#7d7d7f',
  disabledBackground: '#fafafa',
  disabledText: '#a0a0a1',
  surfaceDisabled: '#f4f4f4',
  
  // Backgrounds
  background: '#ffffff',
  backgroundSecondary: '#f8f8f8',
} as const;

export type ColorName = keyof typeof COLORS;

