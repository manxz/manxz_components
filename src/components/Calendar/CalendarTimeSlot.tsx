/**
 * CalendarTimeSlot Component
 *
 * A selectable time slot button for scheduling interfaces.
 * Displays a time range with three visual states.
 *
 * @example
 * ```tsx
 * <CalendarTimeSlot
 *   label="10AM-12PM"
 *   state="available"
 *   onPress={() => handleSelectSlot()}
 * />
 * ```
 */

import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { COLORS } from '../../styles/colors';
import { FONT_FAMILIES, FONT_WEIGHTS, FONT_SIZES } from '../../styles/typography';

// ============================================================================
// TYPES
// ============================================================================

export type CalendarTimeSlotState = 'available' | 'selected' | 'disabled';

export interface CalendarTimeSlotProps {
  /** Time range label (e.g., "10AM-12PM") */
  label: string;
  /** Visual state of the slot */
  state?: CalendarTimeSlotState;
  /** Callback when slot is pressed (only fires for available state) */
  onPress?: () => void;
  /** Custom style for the container */
  style?: StyleProp<ViewStyle>;
  /** Test identifier for automation */
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

const CalendarTimeSlotComponent: React.FC<CalendarTimeSlotProps> = ({
  label,
  state = 'available',
  onPress,
  style,
  testID,
}) => {
  const isDisabled = state === 'disabled';
  const isSelected = state === 'selected';
  const isAvailable = state === 'available';

  const handlePress = useCallback(() => {
    if (isAvailable && onPress) {
      onPress();
    }
  }, [isAvailable, onPress]);

  // Determine container styles based on state
  const getContainerStyle = (pressed: boolean): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.container];

    if (isSelected) {
      baseStyles.push(styles.containerSelected);
    } else if (isDisabled) {
      baseStyles.push(styles.containerDisabled);
    } else {
      baseStyles.push(styles.containerAvailable);
      if (pressed) {
        baseStyles.push(styles.containerPressed);
      }
    }

    return baseStyles;
  };

  // Determine text color based on state
  const getTextColor = (): string => {
    if (isSelected) {
      return COLORS.surface;
    }
    if (isDisabled) {
      return COLORS.disabledText;
    }
    return COLORS.onSurface;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        ...getContainerStyle(pressed),
        style as ViewStyle,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      testID={testID}
    >
      <Text style={[styles.label, { color: getTextColor() }]}>
        {label}
      </Text>
    </Pressable>
  );
};

CalendarTimeSlotComponent.displayName = 'CalendarTimeSlot';

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  containerAvailable: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.outline,
    shadowColor: '#1d1d1f',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  containerSelected: {
    backgroundColor: COLORS.primary,
    shadowColor: '#1d1d1f',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  containerDisabled: {
    backgroundColor: '#f4f4f4',
    borderWidth: 1,
    borderColor: COLORS.outlineLow,
    opacity: 0.7,
  },
  containerPressed: {
    backgroundColor: '#f4f4f4',
  },
  label: {
    fontFamily: FONT_FAMILIES.nunito.bold,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export const CalendarTimeSlot = memo(CalendarTimeSlotComponent);
export default CalendarTimeSlot;

