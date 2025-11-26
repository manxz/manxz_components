/**
 * InputBank Component
 * 
 * Description:
 * A bank account input that displays either an empty "Connect bank account" state
 * or a filled state showing the connected bank details (logo, name, routing number, card).
 * 
 * Props:
 * - bank: BankAccount | null — Connected bank account details (null shows empty state)
 * - emptyTitle: string — Title text for empty state (default: "Connect bank account")
 * - emptySubtitle: string — Subtitle for empty state (default: "3-4 business days")
 * - helperText: string — Optional helper text shown below input
 * - errorText: string — Optional error text (shows error state)
 * - disabled: boolean — Disables interactions
 * - onPress: () => void — Callback when tapped
 * - fullWidth: boolean — Whether input should take full width (default: true)
 * - testID: string — Test identifier
 * 
 * States supported:
 * - empty: Shows bank icon and "Connect bank account"
 * - filled: Shows bank logo, name, and account info
 * - error: Red border and error text
 * - disabled: Muted appearance, non-interactive
 * 
 * Usage example:
 * <InputBank 
 *   bank={{
 *     name: 'Chase Bank',
 *     logoUrl: 'https://...',
 *     logoBackgroundColor: '#004fc2',
 *     routingNumber: '028000212',
 *     cardLastFour: '5671',
 *   }}
 *   onPress={() => openBankSelector()}
 *   helperText="This is where you'll receive payments"
 * />
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Bank, CaretRight } from 'phosphor-react-native';
import { COLORS } from '../../styles/colors';
import { FONT_FAMILIES, FONT_WEIGHTS, FONT_SIZES } from '../../styles/typography';

// ============================================================================
// TYPES
// ============================================================================

export interface BankAccount {
  /** Bank name */
  name: string;
  /** Bank logo URL or require() */
  logoUrl?: string | ImageSourcePropType;
  /** Custom logo component (takes precedence over logoUrl) */
  logoComponent?: React.ReactNode;
  /** Background color for logo container */
  logoBackgroundColor?: string;
  /** Routing number */
  routingNumber?: string;
  /** Last 4 digits of debit card */
  cardLastFour?: string;
}

export interface InputBankProps {
  /** Connected bank account details (null shows empty state) */
  bank?: BankAccount | null;
  /** Title text for empty state */
  emptyTitle?: string;
  /** Subtitle for empty state */
  emptySubtitle?: string;
  /** Optional helper text shown below input */
  helperText?: string;
  /** Optional error text (triggers error state) */
  errorText?: string;
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
  iconContainerSize: 48,
  iconContainerRadius: 6,
  paddingLeft: 8,
  paddingRight: 16,
  paddingVertical: 8,
  gap: 8,
  gapText: 2,
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
// ROUTING NUMBER ICON (custom icon matching Figma)
// ============================================================================

const RoutingIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={styles.routingIcon}>
    {/* Left vertical bar */}
    <View style={[styles.routingBar, { backgroundColor: color }]} />
    {/* Right dots column */}
    <View style={styles.routingDotsContainer}>
      <View style={[styles.routingDot, { backgroundColor: color }]} />
      <View style={[styles.routingDot, { backgroundColor: color }]} />
    </View>
  </View>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const InputBankComponent: React.FC<InputBankProps> = ({
  bank,
  emptyTitle = 'Connect bank account',
  emptySubtitle = '3-4 business days',
  helperText,
  errorText,
  disabled = false,
  onPress,
  fullWidth = true,
  testID,
  _isGrouped = false,
  _groupPosition = 'only',
}) => {
  const hasBank = !!bank;
  const hasError = !!errorText;
  const isDisabled = disabled;

  // ============================================================================
  // COMPUTED STYLES
  // ============================================================================

  const getContainerStyle = (pressed: boolean) => {
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

  const getTitleColor = () => {
    if (isDisabled) return COLORS.disabledText;
    if (hasError) return COLORS.negative;
    return COLORS.onSurface;
  };

  const getSubtitleColor = () => {
    if (isDisabled) return COLORS.disabledText;
    return COLORS.subtext;
  };

  // ============================================================================
  // RENDER CONTENT
  // ============================================================================

  const renderContent = () => {
    if (hasBank && bank) {
      // Filled state - show bank details
      const logoSource = typeof bank.logoUrl === 'string' 
        ? { uri: bank.logoUrl } 
        : bank.logoUrl;

      // Get initials from bank name for fallback logo
      const getInitials = (name: string) => {
        const words = name.split(' ');
        if (words.length >= 2) {
          return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
      };

      return (
        <>
          {/* Bank Logo */}
          <View style={[
            styles.iconContainer,
            styles.iconContainerFilled,
            { backgroundColor: bank.logoBackgroundColor || COLORS.surface }
          ]}>
            {bank.logoComponent ? (
              bank.logoComponent
            ) : logoSource ? (
              <Image 
                source={logoSource} 
                style={styles.bankLogo}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.bankInitials}>{getInitials(bank.name)}</Text>
            )}
          </View>

          {/* Bank Info */}
          <View style={styles.textContainer}>
            <Text 
              style={[styles.title, { color: getTitleColor() }]}
              numberOfLines={1}
            >
              {bank.name}
            </Text>
            <View style={styles.accountInfo}>
              {bank.routingNumber && (
                <View style={styles.routingContainer}>
                  <RoutingIcon color={getSubtitleColor()} />
                  <Text style={[styles.subtitle, { color: getSubtitleColor() }]}>
                    {bank.routingNumber}
                  </Text>
                  <RoutingIcon color={getSubtitleColor()} />
                </View>
              )}
              {bank.cardLastFour && (
                <Text style={[styles.subtitle, { color: getSubtitleColor() }]}>
                  •••• {bank.cardLastFour}
                </Text>
              )}
            </View>
          </View>
        </>
      );
    }

    // Empty state - show connect prompt
    return (
      <>
        {/* Bank Icon Placeholder */}
        <View style={[styles.iconContainer, styles.iconContainerEmpty]}>
          <Bank size={32} color={COLORS.onSurface} weight="regular" />
        </View>

        {/* Connect Text */}
        <View style={styles.textContainer}>
          <Text 
            style={[styles.title, { color: getTitleColor() }]}
            numberOfLines={1}
          >
            {emptyTitle}
          </Text>
          <Text 
            style={[styles.subtitle, { color: getSubtitleColor() }]}
            numberOfLines={1}
          >
            {emptySubtitle}
          </Text>
        </View>
      </>
    );
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
          <View style={styles.leftContent}>
            {renderContent()}
          </View>
          <CaretRight size={24} color={isDisabled ? COLORS.disabledText : COLORS.onSurface} weight="regular" />
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
          <View style={styles.leftContent}>
            {renderContent()}
          </View>
          <CaretRight size={24} color={isDisabled ? COLORS.disabledText : COLORS.onSurface} weight="regular" />
        </View>
      </Pressable>

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
    paddingLeft: SPACING.paddingLeft,
    paddingRight: SPACING.paddingRight,
    paddingVertical: SPACING.paddingVertical,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gap,
  },
  iconContainer: {
    width: SPACING.iconContainerSize,
    height: SPACING.iconContainerSize,
    borderRadius: SPACING.iconContainerRadius,
    borderWidth: 1,
    borderColor: COLORS.outline,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainerEmpty: {
    backgroundColor: COLORS.surface,
  },
  iconContainerFilled: {
    borderColor: COLORS.outline,
  },
  bankLogo: {
    width: 32,
    height: 32,
  },
  bankInitials: {
    fontFamily: FONT_FAMILIES.nunito.bold,
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    gap: SPACING.gapText,
  },
  title: {
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 27,
  },
  subtitle: {
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 19,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gap,
  },
  routingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5, // Gap between icon and number
  },
  routingIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2, // 2px gap between left bar and right bars
  },
  routingBar: {
    width: 2,
    height: 7,
  },
  routingDotsContainer: {
    flexDirection: 'column',
    gap: 3, // 3px gap between the two right bars
  },
  routingDot: {
    width: 2,
    height: 4, // Right bars are 2x4
  },
  helperText: {
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.subtext,
    marginTop: SPACING.gapInputHelper,
    paddingHorizontal: SPACING.paddingRight,
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
    paddingHorizontal: SPACING.paddingRight,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export const InputBank = memo(InputBankComponent);
export default InputBank;

