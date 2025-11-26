/**
 * InputRadio Component
 * 
 * Description:
 * A radio input row with text label and radio button circle on the right.
 * Designed to be used within InputGroup for single-selection lists.
 * 
 * Props:
 * - label: string — Text label displayed on the left
 * - selected: boolean — Whether this option is selected
 * - disabled: boolean — Disables interactions
 * - errorText: string — Optional error text (triggers error state)
 * - onPress: () => void — Callback when tapped
 * - fullWidth: boolean — Whether input should take full width (default: true)
 * - testID: string — Test identifier
 * 
 * States supported:
 * - default: Unselected, empty circle
 * - selected: Filled circle with inner dot
 * - error: Red circle border, red text
 * - disabled: Gray circle, gray text, disabled background
 * 
 * Usage example:
 * <InputGroup>
 *   <InputRadio 
 *     label="Option 1"
 *     selected={selectedValue === 'option1'}
 *     onPress={() => setSelectedValue('option1')}
 *   />
 *   <InputRadio 
 *     label="Option 2"
 *     selected={selectedValue === 'option2'}
 *     onPress={() => setSelectedValue('option2')}
 *   />
 * </InputGroup>
 */

import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { COLORS } from '../../styles/colors';
import { FONT_FAMILIES, FONT_WEIGHTS, FONT_SIZES } from '../../styles/typography';

// ============================================================================
// TYPES
// ============================================================================

export interface InputRadioProps {
  /** Text label displayed on the left */
  label: string;
  /** Whether this option is selected */
  selected?: boolean;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Optional error text (triggers error state - no text shown, just styling) */
  errorText?: string;
  /** Callback when tapped */
  onPress?: () => void;
  /** Whether input should take full width */
  fullWidth?: boolean;
  /** Test identifier */
  testID?: string;
  /** @internal Whether this is inside an InputGroup */
  _isGrouped?: boolean;
  /** @internal Position in group */
  _groupPosition?: 'first' | 'middle' | 'last' | 'only';
}

// ============================================================================
// DESIGN TOKENS (from Figma)
// ============================================================================

const SPACING = {
  height: 64,
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 8,
  radioSize: 24,
  radioInnerSize: 12,
  gapInputHelper: 4,
} as const;

const SHADOW = {
  shadowColor: '#1d1d1f',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 2,
};

// ============================================================================
// RADIO CIRCLE COMPONENT
// ============================================================================

interface RadioCircleProps {
  selected: boolean;
  disabled: boolean;
  hasError: boolean;
}

const RadioCircle: React.FC<RadioCircleProps> = memo(({ selected, disabled, hasError }) => {
  // Determine colors based on state
  const getBorderColor = () => {
    if (disabled) return COLORS.disabledText;
    if (hasError) return COLORS.negative;
    return COLORS.onSurface;
  };

  const getInnerColor = () => {
    if (disabled) return COLORS.disabledText;
    return COLORS.onSurface;
  };

  return (
    <View style={[
      styles.radioCircle,
      { borderColor: getBorderColor() },
      disabled && styles.radioCircleDisabled,
    ]}>
      {selected && (
        <View style={[
          styles.radioInner,
          { backgroundColor: getInnerColor() },
        ]} />
      )}
    </View>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const InputRadioComponent: React.FC<InputRadioProps> = ({
  label,
  selected = false,
  disabled = false,
  errorText,
  onPress,
  fullWidth = true,
  testID,
  _isGrouped = false,
  _groupPosition = 'only',
}) => {
  const hasError = !!errorText;
  const isDisabled = disabled;

  // ============================================================================
  // COMPUTED STYLES
  // ============================================================================

  const getContainerStyle = (pressed: boolean): { backgroundColor: string; borderWidth: number; borderColor: string } => {
    let backgroundColor: string = COLORS.white;
    let borderColor: string = COLORS.outline;
    let borderWidth = hasError && !isDisabled ? 2 : 1;

    if (isDisabled) {
      backgroundColor = COLORS.surfaceDisabled;
    } else if (hasError) {
      backgroundColor = COLORS.negativeSurface;
      borderColor = COLORS.negative;
    } else if (pressed) {
      backgroundColor = COLORS.surface;
    }

    return {
      backgroundColor,
      borderWidth,
      borderColor,
    };
  };

  const getGroupedStyle = (pressed: boolean): any => {
    let backgroundColor: string = COLORS.white;

    if (isDisabled) {
      backgroundColor = COLORS.surfaceDisabled;
    } else if (hasError) {
      backgroundColor = COLORS.negativeSurface;
    } else if (pressed) {
      backgroundColor = COLORS.surface;
    }

    const style: any = { backgroundColor };
    
    const radius = SPACING.borderRadius - 1;
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

  const getGroupedBorderOverlay = (): any => {
    const isActive = hasError && !isDisabled;
    if (!isActive) return null;

    const radius = SPACING.borderRadius;
    const borderColor = COLORS.negative;
    
    const style: any = {
      position: 'absolute',
      left: -1,
      right: -1,
      borderWidth: 2,
      borderColor,
      pointerEvents: 'none',
    };

    switch (_groupPosition) {
      case 'first':
        style.top = -1;
        style.bottom = -1;
        style.borderTopLeftRadius = radius;
        style.borderTopRightRadius = radius;
        break;
      case 'last':
        style.top = -1;
        style.bottom = -1;
        style.borderBottomLeftRadius = radius;
        style.borderBottomRightRadius = radius;
        break;
      case 'only':
        style.top = -1;
        style.bottom = -1;
        style.borderRadius = radius;
        break;
      default:
        style.top = -1;
        style.bottom = -1;
        break;
    }

    return style;
  };

  const getLabelColor = () => {
    if (isDisabled) return COLORS.disabledText;
    if (hasError) return COLORS.negative;
    return COLORS.onSurface;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // Grouped inputs render with border overlay
  if (_isGrouped) {
    const borderOverlay = getGroupedBorderOverlay();
    
    return (
      <Pressable
        style={({ pressed }) => [
          styles.groupedContainer,
          fullWidth && styles.fullWidth,
          getGroupedStyle(pressed && !isDisabled),
        ]}
        onPress={onPress}
        disabled={isDisabled}
        testID={testID}
      >
        {borderOverlay && <View style={borderOverlay} />}
        
        <View style={styles.content}>
          <Text 
            style={[styles.label, { color: getLabelColor() }]}
            numberOfLines={1}
          >
            {label}
          </Text>
          <RadioCircle 
            selected={selected} 
            disabled={isDisabled} 
            hasError={hasError} 
          />
        </View>
      </Pressable>
    );
  }

  // Standalone render (outside InputGroup)
  return (
    <View style={styles.wrapper} testID={testID}>
      <Pressable
        style={({ pressed }) => [
          styles.shadowWrapper, 
          isDisabled ? {} : SHADOW,
          styles.container, 
          fullWidth && styles.fullWidth, 
          getContainerStyle(pressed && !isDisabled),
        ]}
        onPress={onPress}
        disabled={isDisabled}
        testID={testID ? `${testID}-pressable` : undefined}
      >
        <View style={styles.content}>
          <Text 
            style={[styles.label, { color: getLabelColor() }]}
            numberOfLines={1}
          >
            {label}
          </Text>
          <RadioCircle 
            selected={selected} 
            disabled={isDisabled} 
            hasError={hasError} 
          />
        </View>
      </Pressable>
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
    overflow: 'visible',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.paddingHorizontal,
    paddingVertical: SPACING.paddingVertical,
  },
  label: {
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 27,
    flex: 1,
  },
  radioCircle: {
    width: SPACING.radioSize,
    height: SPACING.radioSize,
    borderRadius: SPACING.radioSize / 2,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleDisabled: {
    backgroundColor: COLORS.surfaceDisabled,
  },
  radioInner: {
    width: SPACING.radioInnerSize,
    height: SPACING.radioInnerSize,
    borderRadius: SPACING.radioInnerSize / 2,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export const InputRadio = memo(InputRadioComponent);
export default InputRadio;

