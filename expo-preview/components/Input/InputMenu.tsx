/**
 * InputMenu Component
 * 
 * Description:
 * A simple navigation row with label and chevron. Used for settings menus
 * and navigation triggers. Can be standalone or grouped in InputGroup.
 * 
 * Props:
 * - label: string — Text label displayed on the left
 * - disabled: boolean — Disables interactions
 * - onPress: () => void — Callback when tapped
 * - fullWidth: boolean — Whether input should take full width (default: true)
 * - testID: string — Test identifier
 * 
 * States supported:
 * - default: Normal state
 * - pressed: Subtle background change on press
 * - disabled: Muted appearance, non-interactive
 * 
 * Usage example:
 * <InputGroup>
 *   <InputMenu label="Account Settings" onPress={() => navigate('account')} />
 *   <InputMenu label="Notifications" onPress={() => navigate('notifications')} />
 *   <InputMenu label="Privacy" onPress={() => navigate('privacy')} />
 * </InputGroup>
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { CaretRight } from 'phosphor-react-native';
import { COLORS } from '../../styles/colors';
import { FONT_FAMILIES, FONT_WEIGHTS, FONT_SIZES } from '../../styles/typography';

// ============================================================================
// TYPES
// ============================================================================

export interface InputMenuProps {
  /** Text label displayed on the left */
  label: string;
  /** Whether input is disabled */
  disabled?: boolean;
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
} as const;

const SHADOW = {
  shadowColor: '#1d1d1f',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 2,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const InputMenuComponent: React.FC<InputMenuProps> = ({
  label,
  disabled = false,
  onPress,
  fullWidth = true,
  testID,
  _isGrouped = false,
  _groupPosition = 'only',
}) => {
  const isDisabled = disabled;

  // ============================================================================
  // COMPUTED STYLES
  // ============================================================================

  const getContainerStyle = (pressed: boolean) => {
    let backgroundColor: string = COLORS.white;
    const borderColor: string = COLORS.outline;
    const borderWidth = 1;

    if (isDisabled) {
      backgroundColor = COLORS.surfaceDisabled;
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

  const getLabelColor = () => {
    if (isDisabled) return COLORS.disabledText;
    return COLORS.onSurface;
  };

  const getChevronColor = () => {
    if (isDisabled) return COLORS.disabledText;
    return COLORS.onSurface;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // Grouped inputs
  if (_isGrouped) {
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
        <View style={styles.content}>
          <Text 
            style={[styles.label, { color: getLabelColor() }]}
            numberOfLines={1}
          >
            {label}
          </Text>
          <CaretRight size={24} color={getChevronColor()} weight="regular" />
        </View>
      </Pressable>
    );
  }

  // Standalone render
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
      >
        <View style={styles.content}>
          <Text 
            style={[styles.label, { color: getLabelColor() }]}
            numberOfLines={1}
          >
            {label}
          </Text>
          <CaretRight size={24} color={getChevronColor()} weight="regular" />
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
});

// ============================================================================
// EXPORT
// ============================================================================

export const InputMenu = memo(InputMenuComponent);
export default InputMenu;

