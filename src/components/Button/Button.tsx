/**
 * Button Component
 * 
 * Description:
 * A versatile, production-ready button component with multiple variants and states.
 * Supports icon, loading state, and press interactions with visual feedback.
 * 
 * Props:
 * - text: string — Button label text (required)
 * - variant: 'outline' | 'neutral' | 'primary' | 'positive' | 'negative' — Visual style (default: 'outline')
 * - icon: React.ReactNode — Optional icon element to display before text
 * - disabled: boolean — Disables button interactions (default: false)
 * - loading: boolean — Shows loading state, blocks interactions (default: false)
 * - onPress: (event) => void — Callback fired on button press
 * - fullWidth: boolean — Whether button should take full width (default: false)
 * - testID: string — Test identifier for testing
 * 
 * States supported:
 * - default: Normal interactive state
 * - pressed/active: Visual feedback when user touches button (onPressIn)
 * - disabled: Non-interactive, muted appearance
 * - loading: Shows activity indicator, blocks interaction
 * 
 * Note: This is a mobile-first component. "Pressed" state provides tactile 
 * feedback when the user's finger touches the button (not hover).
 * 
 * Usage example:
 * <Button 
 *   text="Continue" 
 *   variant="primary" 
 *   icon={<ChatIcon />}
 *   onPress={() => console.log('Pressed')} 
 * />
 */

import React, { memo } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { useButton } from './useButton';
import { TYPOGRAPHY } from '../../styles/typography';
import { COLORS } from '../../styles/colors';

// ============================================================================
// TYPES
// ============================================================================

export type ButtonVariant = 'outline' | 'neutral' | 'primary' | 'positive' | 'negative';

export interface ButtonProps {
  /** Button label text */
  text: string;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Optional icon element (24x24 recommended) */
  icon?: React.ReactNode;
  /** Disables button interactions */
  disabled?: boolean;
  /** Shows loading indicator and blocks interaction */
  loading?: boolean;
  /** Callback fired on button press */
  onPress?: (event: any) => void;
  /** Whether button should take full width */
  fullWidth?: boolean;
  /** Enable scale animation on press (default: true) */
  scaleAnimation?: boolean;
  /** Test identifier */
  testID?: string;
}

// ============================================================================
// DESIGN TOKENS
// ============================================================================

const SPACING = {
  height: 64,
  borderRadius: 12,
  gap: 8,
  iconSize: 24,
};

const SHADOW = {
  shadowColor: '#1d1d1f',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 2, // Android shadow
};

// Note: "Pressed" states below provide visual feedback when user touches the button
// These correspond to the "Hover" variants in Figma, but are triggered by touch (onPressIn)

// ============================================================================
// COMPONENT
// ============================================================================

const ButtonComponent: React.FC<ButtonProps> = ({
  text,
  variant = 'outline',
  icon,
  disabled = false,
  loading = false,
  onPress,
  fullWidth = false,
  scaleAnimation = true,
  testID,
}) => {
  const {
    isPressed,
    handlePressIn,
    handlePressOut,
    handlePress,
    isInteractionDisabled,
    scaleValue,
  } = useButton({ onPress, disabled, loading, scaleAnimation });

  // ============================================================================
  // STYLE COMPUTATION
  // ============================================================================

  const getContainerStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.container];
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    // Disabled state (highest priority)
    if (disabled) {
      return [...baseStyle, styles.disabledContainer];
    }

    // Variant-specific styles
    switch (variant) {
      case 'primary':
        return [
          ...baseStyle,
          styles.primaryContainer,
          ...(isPressed ? [styles.primaryContainerPressed] : []),
        ];
      case 'positive':
        return [
          ...baseStyle,
          styles.positiveContainer,
          ...(isPressed ? [styles.positiveContainerPressed] : []),
        ];
      case 'negative':
        return [
          ...baseStyle,
          styles.negativeContainer,
          ...(isPressed ? [styles.negativeContainerPressed] : []),
        ];
      case 'neutral':
        return [
          ...baseStyle,
          styles.neutralContainer,
          ...(isPressed ? [styles.neutralContainerPressed] : []),
        ];
      case 'outline':
      default:
        return [
          ...baseStyle,
          styles.outlineContainer,
          ...(isPressed ? [styles.outlineContainerPressed] : []),
        ];
    }
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle = [styles.text];

    if (disabled) {
      return [...baseStyle, styles.disabledText];
    }

    if (variant === 'outline') {
      return [...baseStyle, styles.outlineText];
    }

    return [...baseStyle, styles.filledText];
  };

  const getIconColor = (): string => {
    if (disabled) {
      return COLORS.subtext;
    }
    if (variant === 'outline') {
      return COLORS.onSurface;
    }
    return COLORS.surface;
  };

  const showLoadingIndicator = loading && variant !== 'outline';

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleValue }],
      }}
    >
      <TouchableOpacity
        style={getContainerStyle()}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={isInteractionDisabled}
        activeOpacity={1} // We handle opacity via style changes
        testID={testID}
        accessible
        accessibilityRole="button"
        accessibilityState={{
          disabled: isInteractionDisabled,
          busy: loading,
        }}
        accessibilityLabel={text}
      >
        <View style={styles.content}>
          {/* Only show icon/loader when needed to keep text centered */}
          {(loading || icon) && (
            <>
              <View style={styles.iconContainer}>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={showLoadingIndicator ? COLORS.surface : COLORS.onSurface}
                  />
                ) : (
                  icon
                )}
              </View>
              <View style={styles.spacer} />
            </>
          )}
          <Text style={getTextStyle()} numberOfLines={1}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    height: SPACING.height,
    borderRadius: SPACING.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    minWidth: 120,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Outline variant
  outlineContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.outline,
    ...SHADOW,
  },
  outlineContainerPressed: {
    backgroundColor: COLORS.whitePressed,
  },
  
  // Primary variant
  primaryContainer: {
    backgroundColor: COLORS.primary,
    ...SHADOW,
  },
  primaryContainerPressed: {
    backgroundColor: COLORS.primaryPressed,
  },
  
  // Positive variant
  positiveContainer: {
    backgroundColor: COLORS.positive,
    ...SHADOW,
  },
  positiveContainerPressed: {
    backgroundColor: COLORS.positivePressed,
  },
  
  // Negative variant
  negativeContainer: {
    backgroundColor: COLORS.negative,
    ...SHADOW,
  },
  negativeContainerPressed: {
    backgroundColor: COLORS.negativePressed,
  },
  
  // Neutral variant
  neutralContainer: {
    backgroundColor: COLORS.neutral,
    ...SHADOW,
  },
  neutralContainerPressed: {
    backgroundColor: COLORS.neutralPressed,
  },
  
  // Disabled state
  disabledContainer: {
    backgroundColor: COLORS.whiteDisabled,
    borderWidth: 1,
    borderColor: COLORS.outlineLow,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Text styles
  text: {
    fontFamily: TYPOGRAPHY.button.fontFamily,
    fontSize: TYPOGRAPHY.button.fontSize,
    fontWeight: TYPOGRAPHY.button.fontWeight,
    textAlign: 'center',
  },
  outlineText: {
    color: COLORS.onSurface,
  },
  filledText: {
    color: COLORS.surface,
  },
  disabledText: {
    color: COLORS.subtext,
  },
  
  // Icon
  iconContainer: {
    width: SPACING.iconSize,
    height: SPACING.iconSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Spacer (gap replacement for RN Web compatibility)
  spacer: {
    width: SPACING.gap,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export const Button = memo(ButtonComponent);
export default Button;

