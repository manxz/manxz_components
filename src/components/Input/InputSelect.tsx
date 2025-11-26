/**
 * InputSelect Component
 * 
 * Description:
 * A select input that opens a full-screen modal with options to choose from.
 * Visually similar to Input but behaves as a button - no inline focus state.
 * 
 * Props:
 * - value: string — The currently selected value
 * - placeholder: string — Placeholder text shown when no value selected
 * - options: Array<{label: string, value: string}> — Options to choose from
 * - helperText: string — Optional helper text shown below input
 * - errorText: string — Optional error text (shows error state)
 * - disabled: boolean — Disables interactions
 * - onChange: (value: string) => void — Callback when selection changes
 * - fullWidth: boolean — Whether input should take full width (default: true)
 * - testID: string — Test identifier
 * - modalTitle: string — Title shown in the modal header
 * 
 * States supported:
 * - default: Normal state with placeholder
 * - filled: Has value, placeholder shown as label above
 * - error: Red border, error text shown below helper text
 * - disabled: Non-interactive, muted appearance
 * 
 * Usage example:
 * <InputSelect 
 *   placeholder="Select country"
 *   options={[
 *     { label: 'United States', value: 'us' },
 *     { label: 'Canada', value: 'ca' },
 *   ]}
 *   onChange={(value) => setCountry(value)}
 * />
 */

import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  Animated,
} from 'react-native';
import { CaretDown, Check, X } from 'phosphor-react-native';
import { COLORS } from '../../styles/colors';
import { FONT_FAMILIES, FONT_WEIGHTS, FONT_SIZES } from '../../styles/typography';

// ============================================================================
// TYPES
// ============================================================================

export interface SelectOption {
  label: string;
  value: string;
}

export interface InputSelectProps {
  /** Currently selected value */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Available options */
  options: SelectOption[];
  /** Optional helper text shown below input */
  helperText?: string;
  /** Optional error text (triggers error state) */
  errorText?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Whether input should take full width */
  fullWidth?: boolean;
  /** Test identifier */
  testID?: string;
  /** Modal title */
  modalTitle?: string;
  /** @internal Whether this is inside an InputGroup */
  _isGrouped?: boolean;
  /** @internal Position in group */
  _groupPosition?: 'first' | 'middle' | 'last' | 'only';
}

// ============================================================================
// DESIGN TOKENS (from Figma - matching Input)
// ============================================================================

const SPACING = {
  height: 64,
  borderRadius: 12,
  paddingHorizontal: 16,
  gap: 2,
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
// OPTION ITEM COMPONENT
// ============================================================================

interface OptionItemProps {
  option: SelectOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

const OptionItem: React.FC<OptionItemProps> = memo(({ option, isSelected, onSelect }) => {
  const handlePress = useCallback(() => {
    onSelect(option.value);
  }, [option.value, onSelect]);

  return (
    <TouchableOpacity 
      style={[styles.optionItem, isSelected && styles.optionItemSelected]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
        {option.label}
      </Text>
      {isSelected && (
        <Check size={20} color={COLORS.primary} weight="bold" />
      )}
    </TouchableOpacity>
  );
});

// ============================================================================
// MODAL COMPONENT
// ============================================================================

interface SelectModalProps {
  visible: boolean;
  title: string;
  options: SelectOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

const SelectModal: React.FC<SelectModalProps> = memo(({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}) => {
  const handleSelect = useCallback((value: string) => {
    onSelect(value);
    onClose();
  }, [onSelect, onClose]);

  const renderItem = useCallback(({ item }: { item: SelectOption }) => (
    <OptionItem
      option={item}
      isSelected={item.value === selectedValue}
      onSelect={handleSelect}
    />
  ), [selectedValue, handleSelect]);

  const keyExtractor = useCallback((item: SelectOption) => item.value, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={24} color={COLORS.onSurface} weight="regular" />
          </TouchableOpacity>
        </View>

        {/* Options List */}
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.optionsList}
          showsVerticalScrollIndicator={false}
          style={styles.optionsListContainer}
        />
      </SafeAreaView>
    </Modal>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const InputSelectComponent: React.FC<InputSelectProps> = ({
  value,
  placeholder = '',
  options,
  helperText,
  errorText,
  disabled = false,
  onChange,
  fullWidth = true,
  testID,
  modalTitle,
  _isGrouped = false,
  _groupPosition = 'only',
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Find selected option label
  const selectedOption = options.find(opt => opt.value === value);
  const hasValue = !!selectedOption;
  const hasError = !!errorText;
  const isDisabled = disabled;

  // Animation for label
  const labelAnim = useRef(new Animated.Value(hasValue ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: hasValue ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [hasValue, labelAnim]);

  const handlePress = useCallback(() => {
    if (!isDisabled) {
      setIsModalVisible(true);
    }
  }, [isDisabled]);

  const handleClose = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleSelect = useCallback((selectedValue: string) => {
    onChange?.(selectedValue);
  }, [onChange]);

  // ============================================================================
  // COMPUTED STYLES
  // ============================================================================

  const getContainerStyle = (): { backgroundColor: string; borderWidth: number; borderColor: string } => {
    let backgroundColor: string = COLORS.white;
    let borderColor: string = COLORS.outline;
    let borderWidth = hasError && !isDisabled ? 2 : 1;

    if (isDisabled) {
      backgroundColor = COLORS.surfaceDisabled;
    } else if (hasError) {
      backgroundColor = COLORS.negativeSurface;
      borderColor = COLORS.negative;
    }

    return {
      backgroundColor,
      borderWidth,
      borderColor,
    };
  };

  const getGroupedStyle = (): any => {
    let backgroundColor: string = COLORS.white;

    if (isDisabled) {
      backgroundColor = COLORS.surfaceDisabled;
    } else if (hasError) {
      backgroundColor = COLORS.negativeSurface;
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

  const getContentPadding = () => {
    if (_isGrouped) return SPACING.paddingHorizontal;
    const isActive = hasError && !isDisabled;
    return isActive ? SPACING.paddingHorizontal - 1 : SPACING.paddingHorizontal;
  };

  const getLabelColor = () => {
    if (isDisabled) return COLORS.disabledText;
    return COLORS.subtext;
  };

  const getValueColor = () => {
    if (isDisabled) return COLORS.disabledText;
    if (hasError) return COLORS.negative;
    return COLORS.onSurface;
  };

  const getIconColor = () => {
    if (isDisabled) return COLORS.disabledText;
    if (hasError) return COLORS.negative;
    return COLORS.subtext;
  };

  // Animated label styles
  const animatedLabelStyle = {
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [FONT_SIZES.xl, FONT_SIZES.sm],
    }),
    lineHeight: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [27, 19],
    }),
    color: getLabelColor(),
  };

  // Animated value visibility
  const valueOpacity = labelAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const valueHeight = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 27],
  });

  // ============================================================================
  // RENDER
  // ============================================================================

  // Grouped inputs render with border overlay
  if (_isGrouped) {
    const borderOverlay = getGroupedBorderOverlay();
    
    return (
      <>
        <TouchableOpacity
          style={[
            styles.groupedContainer,
            fullWidth && styles.fullWidth,
            getGroupedStyle(),
          ]}
          onPress={handlePress}
          activeOpacity={isDisabled ? 1 : 0.7}
          disabled={isDisabled}
          testID={testID}
        >
          {borderOverlay && <View style={borderOverlay} />}
          
          <View style={[styles.content, { paddingHorizontal: getContentPadding() }]}>
            <View style={styles.textContainer}>
              {placeholder && (
                <Animated.Text 
                  style={[styles.label, animatedLabelStyle]} 
                  pointerEvents="none"
                  numberOfLines={1}
                >
                  {placeholder}
                </Animated.Text>
              )}
              <Animated.View style={{ opacity: valueOpacity, height: valueHeight, overflow: 'hidden' }}>
                <Text 
                  style={[styles.value, { color: getValueColor() }]}
                  numberOfLines={1}
                >
                  {selectedOption?.label}
                </Text>
              </Animated.View>
            </View>
            <CaretDown size={20} color={getIconColor()} weight="regular" />
          </View>
        </TouchableOpacity>

        <SelectModal
          visible={isModalVisible}
          title={modalTitle || placeholder}
          options={options}
          selectedValue={value}
          onSelect={handleSelect}
          onClose={handleClose}
        />
      </>
    );
  }

  return (
    <View style={styles.wrapper} testID={testID}>
      <View style={[styles.shadowWrapper, isDisabled ? {} : SHADOW]}>
        <TouchableOpacity
          style={[styles.container, fullWidth && styles.fullWidth, getContainerStyle()]}
          onPress={handlePress}
          activeOpacity={isDisabled ? 1 : 0.7}
          disabled={isDisabled}
        >
          <View style={[styles.content, { paddingHorizontal: getContentPadding() }]}>
            <View style={styles.textContainer}>
              {placeholder && (
                <Animated.Text
                  style={[styles.label, animatedLabelStyle]}
                  pointerEvents="none"
                  numberOfLines={1}
                >
                  {placeholder}
                </Animated.Text>
              )}
              <Animated.View style={{ opacity: valueOpacity, height: valueHeight, overflow: 'hidden' }}>
                <Text 
                  style={[styles.value, { color: getValueColor() }]}
                  numberOfLines={1}
                >
                  {selectedOption?.label}
                </Text>
              </Animated.View>
            </View>
            <CaretDown size={20} color={getIconColor()} weight="regular" />
          </View>
        </TouchableOpacity>
      </View>

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

      {/* Modal */}
      <SelectModal
        visible={isModalVisible}
        title={modalTitle || placeholder}
        options={options}
        selectedValue={value}
        onSelect={handleSelect}
        onClose={handleClose}
      />
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
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    gap: SPACING.gap,
  },
  label: {
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontWeight: FONT_WEIGHTS.medium,
  },
  value: {
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 27,
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
  
  // Modal styles (native pageSheet presentation)
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
  },
  modalTitle: {
    fontFamily: FONT_FAMILIES.nunito.bold,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.onSurface,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsListContainer: {
    flex: 1,
  },
  optionsList: {
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionItemSelected: {
    backgroundColor: COLORS.primarySurface,
  },
  optionLabel: {
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.onSurface,
    flex: 1,
  },
  optionLabelSelected: {
    color: COLORS.primary,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export const InputSelect = memo(InputSelectComponent);
export default InputSelect;
