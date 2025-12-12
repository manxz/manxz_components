/**
 * Input Component
 * 
 * Description:
 * A versatile text input component with multiple states and helper text support.
 * Matches Figma design pixel-perfectly with proper focus, error, and disabled states.
 * 
 * Props:
 * - value: string — Controlled input value
 * - defaultValue: string — Uncontrolled default value
 * - placeholder: string — Placeholder text
 * - helperText: string — Optional helper text shown below input
 * - errorText: string — Optional error text (shows error state)
 * - disabled: boolean — Disables input interactions
 * - onChangeText: (text) => void — Callback when text changes
 * - onFocus: (event) => void — Callback when input receives focus
 * - onBlur: (event) => void — Callback when input loses focus
 * - fullWidth: boolean — Whether input should take full width (default: true)
 * - testID: string — Test identifier
 * 
 * States supported:
 * - default: Normal state with placeholder
 * - active/focused: Blue border, placeholder moves to top as label
 * - filled: Has value, placeholder shown as label above
 * - error: Red border, error text shown below helper text
 * - disabled: Non-interactive, muted appearance (with or without value)
 * 
 * Usage example:
 * <Input 
 *   placeholder="Enter your email"
 *   helperText="We'll never share your email"
 *   onChangeText={(text) => setEmail(text)}
 * />
 */

import React, { memo, useRef, useEffect } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { useInput } from './useInput';
import { COLORS } from '../../styles/colors';
import { FONT_FAMILIES, FONT_WEIGHTS, FONT_SIZES } from '../../styles/typography';

// ============================================================================
// TYPES
// ============================================================================

export interface InputProps extends Omit<TextInputProps, 'value' | 'defaultValue' | 'onChangeText' | 'onFocus' | 'onBlur'> {
  /** Controlled input value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Optional helper text shown below input */
  helperText?: string;
  /** Optional error text (triggers error state) */
  errorText?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Callback when input receives focus */
  onFocus?: () => void;
  /** Callback when input loses focus */
  onBlur?: () => void;
  /** Callback when text changes */
  onChangeText?: (text: string) => void;
  /** Whether input should take full width */
  fullWidth?: boolean;
  /** Test identifier */
  testID?: string;
  /** @internal Whether this is inside an InputGroup */
  _isGrouped?: boolean;
  /** @internal Position in group */
  _groupPosition?: 'first' | 'middle' | 'last' | 'only';
  startFocused?: boolean;
}

// ============================================================================
// DESIGN TOKENS (from Figma)
// ============================================================================

const SPACING = {
  height: 64,
  borderRadius: 12,
  innerBorderRadius: 8, // Smaller radius for active state to fit inside container
  paddingHorizontal: 16,
  gap: 2, // Gap between label and input text
  gapInputHelper: 4, // Gap between input and helper text
} as const;

// Drop shadow (same as outline button)
const SHADOW = {
  shadowColor: '#1d1d1f',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 2,
};

// ============================================================================
// COMPONENT
// ============================================================================

const InputComponent: React.FC<InputProps> = ({
  value: controlledValue,
  defaultValue,
  placeholder = '',
  helperText,
  errorText,
  disabled = false,
  onChangeText,
  onFocus,
  onBlur,
  fullWidth = true,
  testID,
  _isGrouped = false,
  _groupPosition = 'only',
  startFocused = false,
  ...textInputProps
}) => {
  const {
    value,
    isFocused,
    hasValue,
    handleChangeText,
    handleFocus,
    handleBlur,
  } = useInput({
    value: controlledValue,
    defaultValue,
    onChangeText,
    onFocus,
    onBlur,
    disabled,
  });

  const inputRef = useRef<TextInput>(null);

  // State flags
  const showLabel = hasValue || isFocused;
  const hasError = !!errorText;
  const isDisabled = disabled;

  // Animation for label position/size
  const labelAnim = useRef(new Animated.Value(showLabel ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: showLabel ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [showLabel, labelAnim]);

  const handleContainerPress = () => {
    if (!isDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (startFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [startFocused]);

  // ============================================================================
  // COMPUTED STYLES
  // ============================================================================

  // Container background and border based on state (for standalone inputs)
  const getContainerStyle = (): { backgroundColor: string; borderWidth: number; borderColor: string } => {
    const isActive = (hasError || isFocused) && !isDisabled;
    
    let backgroundColor: string = COLORS.white;
    let borderColor: string = COLORS.outline;
    let borderWidth = isActive ? 2 : 1;

    if (isDisabled) {
      backgroundColor = COLORS.surfaceDisabled;
    } else if (hasError) {
      backgroundColor = COLORS.negativeSurface;
      borderColor = COLORS.negative;
    } else if (isFocused) {
      backgroundColor = COLORS.primarySurface;
      borderColor = COLORS.primary;
    }

    return {
      backgroundColor,
      borderWidth,
      borderColor,
    };
  };

  // Get style for grouped inputs (background + border radius to match row)
  const getGroupedStyle = (): any => {
    let backgroundColor: string = COLORS.white;

    if (isDisabled) {
      backgroundColor = COLORS.surfaceDisabled;
    } else if (hasError) {
      backgroundColor = COLORS.negativeSurface;
    } else if (isFocused) {
      backgroundColor = COLORS.primarySurface;
    }

    const style: any = { backgroundColor };
    
    // Match border radius to row's border radius so background doesn't stick out
    const radius = SPACING.borderRadius - 1; // Slightly smaller to fit inside row's border
    switch (_groupPosition) {
      case 'first':
        style.borderTopLeftRadius = radius;
        style.borderTopRightRadius = radius;
        break;
      case 'last':
        style.borderBottomLeftRadius = radius;
        style.borderBottomRightRadius = radius;
        break;
      case 'only':
        style.borderRadius = radius;
        break;
    }

    return style;
  };

  // Get border overlay style for grouped inputs (absolutely positioned, doesn't affect layout)
  const getGroupedBorderOverlay = (): any => {
    const isActive = (hasError || isFocused) && !isDisabled;
    if (!isActive) return null;

    const radius = SPACING.borderRadius;
    const borderColor = hasError ? COLORS.negative : COLORS.primary;
    
    const style: any = {
      position: 'absolute',
      // Extend outside to cover the row's 1px border
      left: -1,
      right: -1,
      borderWidth: 2,
      borderColor,
      pointerEvents: 'none',
    };

    switch (_groupPosition) {
      case 'first':
        style.top = -1;
        style.bottom = -1; // Extend to cover divider
        style.borderTopLeftRadius = radius;
        style.borderTopRightRadius = radius;
        break;
      case 'last':
        style.top = -1; // Extend to cover divider above
        style.bottom = -1;
        style.borderBottomLeftRadius = radius;
        style.borderBottomRightRadius = radius;
        break;
      case 'only':
        style.top = -1;
        style.bottom = -1;
        style.borderRadius = radius;
        break;
      default: // middle
        style.top = -1;
        style.bottom = -1;
        break;
    }

    return style;
  };

  // Compensate padding for border width change (1px border = 16px padding, 2px border = 15px padding)
  // This prevents content shift when border changes (only for standalone, grouped uses overlay)
  const getContentPadding = () => {
    if (_isGrouped) return SPACING.paddingHorizontal; // No compensation needed for grouped
    const isActive = (hasError || isFocused) && !isDisabled;
    return isActive ? SPACING.paddingHorizontal - 1 : SPACING.paddingHorizontal;
  };

  // Label color
  const getLabelColor = () => {
    if (isDisabled) return COLORS.disabledText;
    return COLORS.subtext;
  };

  // Input text color
  const getInputColor = () => {
    if (isDisabled) return COLORS.disabledText;
    if (hasError) return COLORS.negative;
    return COLORS.onSurface;
  };

  // Animated label: interpolate from placeholder (20px, centered) to label (14px, top)
  const animatedLabelStyle = {
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [FONT_SIZES.xl, FONT_SIZES.sm], // 20px → 14px
    }),
    lineHeight: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [27, 19], // 27px → 19px
    }),
    color: getLabelColor(),
  };

  // Animated input visibility (hidden when no label shown)
  const inputOpacity = labelAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  // Animated input height (0 when hidden so it doesn't push label off-center)
  const inputHeight = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 27], // 0 when hidden, 27px (line height) when visible
  });

  // ============================================================================
  // RENDER
  // ============================================================================

  // Grouped inputs render with border overlay (no layout shifts)
  if (_isGrouped) {
    const borderOverlay = getGroupedBorderOverlay();
    
    return (
      <TouchableWithoutFeedback onPress={handleContainerPress}>
        <View 
          style={[
            styles.groupedContainer, 
            fullWidth && styles.fullWidth, 
            getGroupedStyle(),
          ]}
        >
          {/* Border overlay - absolutely positioned, doesn't affect layout */}
          {borderOverlay && <View style={borderOverlay} />}
          
          <View style={[styles.content, { paddingHorizontal: getContentPadding() }]}>
            {placeholder && (
              <Animated.Text 
                style={[styles.label, animatedLabelStyle]} 
                pointerEvents="none"
                numberOfLines={1}
              >
                {placeholder}
              </Animated.Text>
            )}
            <Animated.View style={{ opacity: inputOpacity, height: inputHeight, width: '100%', overflow: 'hidden' }}>
              <TextInput
                ref={inputRef}
                style={[styles.input, { color: getInputColor() }]}
                value={value}
                onChangeText={handleChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={undefined}
                editable={!isDisabled}
                testID={testID ? `${testID}-input` : undefined}
                {...textInputProps}
              />
            </Animated.View>
          </View>
        </View>

        {/* Error Text */}
        {errorText && (
          <Text style={styles.errorText}>{errorText}</Text>
        )}

      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={styles.wrapper} testID={testID}>
      <TouchableWithoutFeedback onPress={handleContainerPress}>
        <View style={[styles.shadowWrapper, isDisabled ? {} : SHADOW]}>
          <View style={[styles.container, fullWidth && styles.fullWidth, getContainerStyle()]}>
            {/* Content: flex column, gap 2px, vertically centered */}
            <View style={[styles.content, { paddingHorizontal: getContentPadding() }]}>
              {/* Label (animated placeholder) */}
              {placeholder && (
                <Animated.Text
                  style={[styles.label, animatedLabelStyle]}
                  pointerEvents="none"
                >
                  {placeholder}
                </Animated.Text>
              )}

              {/* Input text - always rendered, visibility and height animated */}
              <Animated.View style={{ opacity: inputOpacity, height: inputHeight, width: '100%', overflow: 'hidden' }}>
                <TextInput
                  ref={inputRef}
                  style={[styles.input, { color: getInputColor() }]}
                  value={value}
                  onChangeText={handleChangeText}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder={undefined}
                  editable={!isDisabled}
                  testID={testID ? `${testID}-input` : undefined}
                  {...textInputProps}
                />
              </Animated.View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Helper Text */}
      {helperText && (
        <Text style={[styles.helperText, isDisabled && styles.disabledText]}>
          {helperText}
        </Text>
      )}

      {/* Error Text */}
      {errorText && (
        <Text style={styles.errorText}>{errorText}</Text>
      )}
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  shadowWrapper: {
    borderRadius: SPACING.borderRadius,
  },
  container: {
    height: SPACING.height,
    borderRadius: SPACING.borderRadius,
    overflow: 'hidden',
  },
  groupedContainer: {
    height: SPACING.height,
    position: 'relative',
    overflow: 'visible', // Allow border overlay to extend outside
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // paddingHorizontal set dynamically to compensate for border width changes
    gap: SPACING.gap,
  },
  label: {
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontWeight: FONT_WEIGHTS.medium,
  },
  input: {
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 27,
    padding: 0,
    margin: 0,
    width: '100%',
  },
  helperText: {
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.subtext,
    marginTop: SPACING.gapInputHelper,
    paddingHorizontal: SPACING.paddingHorizontal,
  },
  disabledText: {
    color: COLORS.disabledText,
  },
  errorText: {
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.negative,
    marginTop: SPACING.gapInputHelper,
    paddingHorizontal: SPACING.paddingHorizontal,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export const Input = memo(InputComponent);
export default Input;
