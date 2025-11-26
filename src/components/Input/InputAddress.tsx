/**
 * InputAddress Component
 * 
 * Description:
 * An address input that opens a full-screen modal for address search.
 * Similar to InputSelect but with a text input inside the modal for searching.
 * 
 * Props:
 * - value: string — The currently selected address
 * - placeholder: string — Placeholder text (default: "Address")
 * - suggestions: Array<{id: string, address: string}> — Autocomplete suggestions
 * - helperText: string — Optional helper text shown below input
 * - errorText: string — Optional error text (shows error state)
 * - disabled: boolean — Disables interactions
 * - onChangeText: (text: string) => void — Callback when search text changes (use to fetch suggestions)
 * - onSelectAddress: (address: string) => void — Callback when address is selected
 * - fullWidth: boolean — Whether input should take full width (default: true)
 * - testID: string — Test identifier
 * - maxSuggestions: number — Maximum suggestions to show (default: 5)
 * 
 * States supported:
 * - default: Normal state with placeholder
 * - filled: Has selected address value
 * - error: Red border, error text shown
 * - disabled: Non-interactive, muted appearance
 * 
 * Usage example:
 * <InputAddress 
 *   placeholder="Address"
 *   value={address}
 *   suggestions={addressSuggestions}
 *   onChangeText={(text) => fetchSuggestions(text)}
 *   onSelectAddress={(address) => setAddress(address)}
 * />
 */

import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { X } from 'phosphor-react-native';
import { COLORS } from '../../styles/colors';
import { FONT_FAMILIES, FONT_WEIGHTS, FONT_SIZES } from '../../styles/typography';

// ============================================================================
// TYPES
// ============================================================================

export interface AddressSuggestion {
  /** Unique identifier for the suggestion */
  id: string;
  /** Full address string */
  address: string;
}

export interface InputAddressProps {
  /** Currently selected address */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Autocomplete suggestions */
  suggestions?: AddressSuggestion[];
  /** Maximum number of suggestions to display (default: 5) */
  maxSuggestions?: number;
  /** Optional helper text shown below input */
  helperText?: string;
  /** Optional error text (triggers error state) */
  errorText?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Callback when search text changes (use to fetch suggestions) */
  onChangeText?: (text: string) => void;
  /** Callback when address is selected */
  onSelectAddress?: (address: string) => void;
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
// DESIGN TOKENS (from Figma - matching Input)
// ============================================================================

const SPACING = {
  height: 64,
  borderRadius: 12,
  paddingHorizontal: 16,
  gap: 2,
  gapInputHelper: 4,
  suggestionItemHeight: 56,
} as const;

const SHADOW = {
  shadowColor: '#1d1d1f',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 2,
};

// ============================================================================
// SUGGESTION ITEM COMPONENT
// ============================================================================

interface SuggestionItemProps {
  suggestion: AddressSuggestion;
  searchText: string;
  onSelect: (address: string) => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = memo(({
  suggestion,
  searchText,
  onSelect,
}) => {
  const handlePress = useCallback(() => {
    onSelect(suggestion.address);
  }, [suggestion.address, onSelect]);

  // Render address with highlighted matching text
  const renderHighlightedText = () => {
    if (!searchText) {
      return <Text style={styles.suggestionText}>{suggestion.address}</Text>;
    }

    const address = suggestion.address;
    const searchLower = searchText.toLowerCase();
    const addressLower = address.toLowerCase();
    const matchIndex = addressLower.indexOf(searchLower);

    if (matchIndex === -1) {
      return <Text style={styles.suggestionText}>{address}</Text>;
    }

    const beforeMatch = address.slice(0, matchIndex);
    const match = address.slice(matchIndex, matchIndex + searchText.length);
    const afterMatch = address.slice(matchIndex + searchText.length);

    return (
      <Text style={styles.suggestionText}>
        {beforeMatch}
        <Text style={styles.suggestionTextBold}>{match}</Text>
        {afterMatch}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {renderHighlightedText()}
    </TouchableOpacity>
  );
});

// ============================================================================
// MODAL COMPONENT
// ============================================================================

interface AddressModalProps {
  visible: boolean;
  placeholder: string;
  suggestions: AddressSuggestion[];
  onChangeText: (text: string) => void;
  onSelectAddress: (address: string) => void;
  onClose: () => void;
}

const AddressModal: React.FC<AddressModalProps> = memo(({
  visible,
  placeholder,
  suggestions,
  onChangeText,
  onSelectAddress,
  onClose,
}) => {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Reset search text when modal opens
  useEffect(() => {
    if (visible) {
      setSearchText('');
      // Auto-focus the input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  const handleChangeText = useCallback((text: string) => {
    setSearchText(text);
    onChangeText(text);
  }, [onChangeText]);

  const handleSelectAddress = useCallback((address: string) => {
    onSelectAddress(address);
    onClose();
  }, [onSelectAddress, onClose]);

  const handleSelectButtonPress = useCallback(() => {
    if (searchText.trim()) {
      onSelectAddress(searchText);
      onClose();
    }
  }, [searchText, onSelectAddress, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        {/* Close button */}
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={24} color={COLORS.onSurface} weight="regular" />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.modalInputContainer}>
          <View style={[styles.modalInputWrapper, searchText.length > 0 && styles.modalInputWrapperActive]}>
            <View style={styles.modalInputContent}>
              {/* Animated label */}
              <Text style={[
                styles.modalInputLabel,
                searchText.length > 0 && styles.modalInputLabelSmall
              ]}>
                {placeholder}
              </Text>
              {searchText.length > 0 && (
                <TextInput
                  ref={inputRef}
                  style={styles.modalInput}
                  value={searchText}
                  onChangeText={handleChangeText}
                  autoFocus
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              )}
              {searchText.length === 0 && (
                <TextInput
                  ref={inputRef}
                  style={[styles.modalInput, styles.modalInputPlaceholder]}
                  value={searchText}
                  onChangeText={handleChangeText}
                  autoFocus
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              )}
            </View>
          </View>
        </View>

        {/* Suggestions List */}
        <ScrollView 
          style={styles.suggestionsList}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {suggestions.map((suggestion) => (
            <SuggestionItem
              key={suggestion.id}
              suggestion={suggestion}
              searchText={searchText}
              onSelect={handleSelectAddress}
            />
          ))}
        </ScrollView>

        {/* Select Button */}
        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[
              styles.selectButton,
              !searchText.trim() && styles.selectButtonDisabled
            ]}
            onPress={handleSelectButtonPress}
            activeOpacity={0.8}
            disabled={!searchText.trim()}
          >
            <Text style={[
              styles.selectButtonText,
              !searchText.trim() && styles.selectButtonTextDisabled
            ]}>
              Select address
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const InputAddressComponent: React.FC<InputAddressProps> = ({
  value,
  placeholder = 'Address',
  suggestions = [],
  maxSuggestions = 5,
  helperText,
  errorText,
  disabled = false,
  onChangeText,
  onSelectAddress,
  fullWidth = true,
  testID,
  _isGrouped = false,
  _groupPosition = 'only',
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Limit suggestions
  const limitedSuggestions = suggestions.slice(0, maxSuggestions);
  
  const hasValue = !!value;
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

  const handleChangeText = useCallback((text: string) => {
    onChangeText?.(text);
  }, [onChangeText]);

  const handleSelectAddress = useCallback((address: string) => {
    onSelectAddress?.(address);
  }, [onSelectAddress]);

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
                  {value}
                </Text>
              </Animated.View>
            </View>
          </View>
        </TouchableOpacity>

        <AddressModal
          visible={isModalVisible}
          placeholder={placeholder}
          suggestions={limitedSuggestions}
          onChangeText={handleChangeText}
          onSelectAddress={handleSelectAddress}
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
                  {value}
                </Text>
              </Animated.View>
            </View>
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
      <AddressModal
        visible={isModalVisible}
        placeholder={placeholder}
        suggestions={limitedSuggestions}
        onChangeText={handleChangeText}
        onSelectAddress={handleSelectAddress}
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
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalInputWrapper: {
    height: SPACING.height,
    borderRadius: SPACING.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.outline,
    backgroundColor: COLORS.white,
  },
  modalInputWrapperActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySurface,
  },
  modalInputContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.paddingHorizontal,
    gap: SPACING.gap,
  },
  modalInputLabel: {
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.subtext,
    lineHeight: 27,
  },
  modalInputLabelSmall: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 19,
  },
  modalInput: {
    fontFamily: FONT_FAMILIES.nunito.medium,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.onSurface,
    lineHeight: 27,
    padding: 0,
    margin: 0,
  },
  modalInputPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    height: SPACING.suggestionItemHeight,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineLow,
  },
  suggestionText: {
    fontFamily: FONT_FAMILIES.nunito.regular,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.onSurface,
  },
  suggestionTextBold: {
    fontFamily: FONT_FAMILIES.nunito.bold,
    fontWeight: FONT_WEIGHTS.bold,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  selectButton: {
    height: SPACING.height,
    backgroundColor: COLORS.neutral,
    borderRadius: SPACING.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButtonDisabled: {
    backgroundColor: COLORS.surfaceDisabled,
  },
  selectButtonText: {
    fontFamily: FONT_FAMILIES.nunito.bold,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  selectButtonTextDisabled: {
    color: COLORS.disabledText,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export const InputAddress = memo(InputAddressComponent);
export default InputAddress;
