/**
 * InputSplit Component
 * 
 * Two inputs side by side in a single container with a vertical divider.
 * Each input can be independently focused/filled with proper visual states.
 */

import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { COLORS } from '../../styles/colors';
import { FONT_FAMILIES, FONT_WEIGHTS, FONT_SIZES } from '../../styles/typography';

// ============================================================================
// TYPES
// ============================================================================

export interface InputSplitProps {
  leftPlaceholder?: string;
  rightPlaceholder?: string;
  leftValue?: string;
  rightValue?: string;
  leftDefaultValue?: string;
  rightDefaultValue?: string;
  onLeftChange?: (text: string) => void;
  onRightChange?: (text: string) => void;
  leftKeyboardType?: string;
  rightKeyboardType?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  testID?: string;
  _isGrouped?: boolean;
  _groupPosition?: 'first' | 'middle' | 'last' | 'only';
}

// ============================================================================
// DESIGN TOKENS
// ============================================================================

const SPACING = {
  height: 64,
  borderRadius: 12,
  paddingHorizontal: 16,
  gap: 2,
} as const;

const SHADOW = {
  shadowColor: '#1d1d1f',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 2,
};

// ============================================================================
// INPUT CELL COMPONENT
// ============================================================================

interface InputCellProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  disabled?: boolean;
  position: 'left' | 'right';
  isGrouped?: boolean;
  groupPosition?: 'first' | 'middle' | 'last' | 'only';
  inputRef: React.RefObject<TextInput>;
  onFocusChange: (focused: boolean) => void;
  otherCellFocused: boolean;
  keyboardType?: string;
}

const InputCell: React.FC<InputCellProps> = ({
  placeholder = '',
  value: controlledValue,
  defaultValue = '',
  onChangeText,
  disabled = false,
  position,
  isGrouped = false,
  groupPosition = 'only',
  inputRef,
  onFocusChange,
  otherCellFocused,
  keyboardType,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const hasValue = value.length > 0;
  const showLabel = hasValue || isFocused;
  const isActive = isFocused && !disabled;

  const labelAnim = useRef(new Animated.Value(showLabel ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: showLabel ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [showLabel, labelAnim]);

  useEffect(() => {
    onFocusChange(isFocused);
  }, [isFocused, onFocusChange]);

  const handleChangeText = useCallback((text: string) => {
    if (!disabled) {
      if (controlledValue === undefined) {
        setInternalValue(text);
      }
      onChangeText?.(text);
    }
  }, [disabled, controlledValue, onChangeText]);

  const handleFocus = useCallback(() => {
    if (!disabled) setIsFocused(true);
  }, [disabled]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handlePress = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Get base cell style (background + border radius to match row)
  const getCellStyle = (): any => {
    let backgroundColor = COLORS.white;
    if (isActive) {
      backgroundColor = COLORS.primarySurface;
    } else if (disabled) {
      backgroundColor = COLORS.surfaceDisabled;
    }

    const style: any = { backgroundColor };

    // When grouped, add border radius to match row so background doesn't stick out
    if (isGrouped) {
      const radius = SPACING.borderRadius - 1;
      if (position === 'left') {
        if (groupPosition === 'first' || groupPosition === 'only') {
          style.borderTopLeftRadius = radius;
        }
        if (groupPosition === 'last' || groupPosition === 'only') {
          style.borderBottomLeftRadius = radius;
        }
      } else {
        if (groupPosition === 'first' || groupPosition === 'only') {
          style.borderTopRightRadius = radius;
        }
        if (groupPosition === 'last' || groupPosition === 'only') {
          style.borderBottomRightRadius = radius;
        }
      }
    }

    return style;
  };

  // Get border overlay style (absolutely positioned, doesn't affect layout)
  const getBorderOverlayStyle = (): any => {
    const radius = SPACING.borderRadius;
    
    if (isGrouped) {
      if (!isActive) return null; // No overlay when inactive in group
      
      const style: any = {
        position: 'absolute',
        top: -1,
        bottom: -1,
        borderWidth: 2,
        borderColor: COLORS.primary,
        pointerEvents: 'none',
      };
      
      if (position === 'left') {
        style.left = -1;
        style.right = -1; // Extend to cover divider area
        if (groupPosition === 'first' || groupPosition === 'only') {
          style.borderTopLeftRadius = radius;
        }
        if (groupPosition === 'last' || groupPosition === 'only') {
          style.borderBottomLeftRadius = radius;
        }
      } else {
        style.left = -1; // Extend to cover divider area
        style.right = -1;
        if (groupPosition === 'first' || groupPosition === 'only') {
          style.borderTopRightRadius = radius;
        }
        if (groupPosition === 'last' || groupPosition === 'only') {
          style.borderBottomRightRadius = radius;
        }
      }
      
      return style;
    }
    
    // Standalone split
    if (isActive) {
      const style: any = {
        position: 'absolute',
        top: -1,
        bottom: -1,
        borderWidth: 2,
        borderColor: COLORS.primary,
        pointerEvents: 'none',
      };
      
      if (position === 'left') {
        style.left = -1;
        style.right = -1; // Extend to cover the divider area
        style.borderTopLeftRadius = radius;
        style.borderBottomLeftRadius = radius;
      } else {
        style.left = -1; // Extend to cover the divider area
        style.right = -1;
        style.borderTopRightRadius = radius;
        style.borderBottomRightRadius = radius;
      }
      
      return style;
    }
    
    return null;
  };

  // Animated styles
  const animatedLabelStyle = {
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [FONT_SIZES.xl, FONT_SIZES.sm],
    }),
    lineHeight: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [27, 19],
    }),
    color: disabled ? COLORS.disabledText : COLORS.subtext,
  };

  const inputOpacity = labelAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const inputHeight = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 27],
  });

  const borderOverlayStyle = getBorderOverlayStyle();

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.cell, getCellStyle()]}>
        {/* Active border overlay - absolutely positioned, doesn't affect layout */}
        {borderOverlayStyle && <View style={borderOverlayStyle} />}
        
        <View style={styles.cellContent}>
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
              style={[styles.input, { color: disabled ? COLORS.disabledText : COLORS.onSurface }]}
              value={value}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={undefined}
              editable={!disabled}
              keyboardType={keyboardType}
            />
          </Animated.View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const InputSplitComponent: React.FC<InputSplitProps> = ({
  leftPlaceholder,
  rightPlaceholder,
  leftValue,
  rightValue,
  leftDefaultValue,
  rightDefaultValue,
  onLeftChange,
  onRightChange,
  leftKeyboardType = 'default',
  rightKeyboardType = 'default',
  disabled = false,
  fullWidth = true,
  testID,
  _isGrouped = false,
  _groupPosition = 'only',
}) => {
  const leftInputRef = useRef<TextInput>(null);
  const rightInputRef = useRef<TextInput>(null);
  const [leftFocused, setLeftFocused] = useState(false);
  const [rightFocused, setRightFocused] = useState(false);

  return (
    <View 
      style={[
        styles.wrapper, 
        fullWidth && styles.fullWidth,
        !_isGrouped && styles.standaloneWrapper,
        !_isGrouped && !disabled && SHADOW,
      ]} 
      testID={testID}
    >
      <View style={styles.container}>
        <InputCell
          placeholder={leftPlaceholder}
          value={leftValue}
          defaultValue={leftDefaultValue}
          onChangeText={onLeftChange}
          disabled={disabled}
          position="left"
          isGrouped={_isGrouped}
          groupPosition={_groupPosition}
          inputRef={leftInputRef}
          onFocusChange={setLeftFocused}
          otherCellFocused={rightFocused}
          keyboardType={leftKeyboardType}
        />
        {/* Divider - always visible */}
        <View style={styles.divider} />
        <InputCell
          placeholder={rightPlaceholder}
          value={rightValue}
          defaultValue={rightDefaultValue}
          onChangeText={onRightChange}
          disabled={disabled}
          position="right"
          isGrouped={_isGrouped}
          groupPosition={_groupPosition}
          inputRef={rightInputRef}
          onFocusChange={setRightFocused}
          otherCellFocused={leftFocused}
          keyboardType={rightKeyboardType}
        />
      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: SPACING.borderRadius,
    overflow: 'visible', // Allow border overlay to extend outside
  },
  fullWidth: {
    width: '100%',
  },
  standaloneWrapper: {
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: SPACING.borderRadius,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    overflow: 'visible',
  },
  cell: {
    flex: 1,
    height: SPACING.height,
    justifyContent: 'center',
    position: 'relative', // For absolute positioned border overlay
    overflow: 'visible',
  },
  cellContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.paddingHorizontal,
    gap: SPACING.gap,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.outline,
    alignSelf: 'stretch',
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
});

// ============================================================================
// EXPORT
// ============================================================================

export const InputSplit = memo(InputSplitComponent);
export default InputSplit;
