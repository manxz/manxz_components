/**
 * InputGroup Component
 * 
 * A container that stacks multiple inputs vertically with dividers.
 * Can contain regular Input components or InputSplit components.
 */

import React, { memo, Children, cloneElement, isValidElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../../styles/colors';
import { FONT_FAMILIES, FONT_SIZES } from '../../styles/typography';

// ============================================================================
// TYPES
// ============================================================================

export interface InputGroupProps {
  children: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  errorTexts?: string[];
  testID?: string;
}

// ============================================================================
// DESIGN TOKENS
// ============================================================================

const SPACING = {
  borderRadius: 12,
  height: 64,
} as const;

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

const InputGroupComponent: React.FC<InputGroupProps> = ({
  children,
  disabled = false,
  fullWidth = true,
  errorTexts = [],
  testID,
}) => {
  const childArray = Children.toArray(children).filter(isValidElement);
  const childCount = childArray.length;

  return (
    <>
    <View 
      style={[
        styles.wrapper, 
        fullWidth && styles.fullWidth,
        !disabled && SHADOW,
      ]} 
      testID={testID}
    >
      {childArray.map((child, index) => {
        // Determine position in group
        let groupPosition: 'first' | 'middle' | 'last' | 'only' = 'middle';
        if (childCount === 1) {
          groupPosition = 'only';
        } else if (index === 0) {
          groupPosition = 'first';
        } else if (index === childCount - 1) {
          groupPosition = 'last';
        }

        const isFirst = index === 0;
        const isLast = index === childCount - 1;

        // Clone child with group-specific props
        const enhancedChild = cloneElement(child as React.ReactElement, {
          _isGrouped: true,
          _groupPosition: groupPosition,
          disabled: disabled || (child as React.ReactElement).props.disabled,
          fullWidth: true,
        });

        // Row style with borders
        const rowStyle: any = {
          width: '100%',
          position: 'relative',
          overflow: 'visible', // Allow overlay to extend outside
          // Left and right borders always
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderLeftColor: COLORS.outline,
          borderRightColor: COLORS.outline,
        };

        // Top border and radius for first row
        if (isFirst) {
          rowStyle.borderTopWidth = 1;
          rowStyle.borderTopColor = COLORS.outline;
          rowStyle.borderTopLeftRadius = SPACING.borderRadius;
          rowStyle.borderTopRightRadius = SPACING.borderRadius;
        }

        // Bottom border and radius for last row
        if (isLast) {
          rowStyle.borderBottomWidth = 1;
          rowStyle.borderBottomColor = COLORS.outline;
          rowStyle.borderBottomLeftRadius = SPACING.borderRadius;
          rowStyle.borderBottomRightRadius = SPACING.borderRadius;
        }

        // Divider for non-last rows
        if (!isLast) {
          rowStyle.borderBottomWidth = 1;
          rowStyle.borderBottomColor = COLORS.outline;
        }

        return (
          <View key={index} style={rowStyle}>
            {enhancedChild}
          </View>
        );
      })}
    </View>
    {errorTexts && errorTexts.map((text, index) => (
      <Text key={index} style={styles.errors}>{text}</Text>
    ))}
    </>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: SPACING.borderRadius,
    overflow: 'hidden', // Allow border overlays to extend outside
  },
  fullWidth: {
    width: '100%',
  },
  errors: {
    color: COLORS.negative,
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontSize: FONT_SIZES.base,
  }
});

// ============================================================================
// EXPORT
// ============================================================================

export const InputGroup = memo(InputGroupComponent);
export default InputGroup;
