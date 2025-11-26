/**
 * InputAddress Component
 * 
 * Description:
 * An address input with autocomplete suggestions dropdown.
 * Visually matches the Input component with added suggestion list.
 * 
 * Props:
 * - value: string — Controlled input value
 * - placeholder: string — Placeholder text (default: "Address")
 * - suggestions: Array<{id: string, address: string}> — Autocomplete suggestions
 * - helperText: string — Optional helper text shown below input
 * - errorText: string — Optional error text (shows error state)
 * - disabled: boolean — Disables input interactions
 * - onChangeText: (text: string) => void — Callback when text changes (use to fetch suggestions)
 * - onSelectSuggestion: (suggestion) => void — Callback when user selects a suggestion
 * - onFocus: () => void — Callback when input receives focus
 * - onBlur: () => void — Callback when input loses focus
 * - fullWidth: boolean — Whether input should take full width (default: true)
 * - testID: string — Test identifier
 * - highlightMatch: boolean — Whether to bold the matching text in suggestions (default: true)
 * 
 * States supported:
 * - default: Normal state with placeholder
 * - active/focused: Blue border, shows suggestions if available
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
 *   onSelectSuggestion={(suggestion) => setAddress(suggestion.address)}
 * />
 */

import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
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
  /** Controlled input value */
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
  /** Callback when text changes */
  onChangeText?: (text: string) => void;
  /** Callback when a suggestion is selected */
  onSelectSuggestion?: (suggestion: AddressSuggestion) => void;
  /** Callback when input receives focus */
  onFocus?: () => void;
  /** Callback when input loses focus */
  onBlur?: () => void;
  /** Whether input should take full width */
  fullWidth?: boolean;
  /** Test identifier */
  testID?: string;
  /** Whether to highlight matching text in suggestions */
  highlightMatch?: boolean;
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

const DROPDOWN_SHADOW = {
  shadowColor: '#1d1d1f',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
};

// ============================================================================
// SUGGESTION ITEM COMPONENT
// ============================================================================

interface SuggestionItemProps {
  suggestion: AddressSuggestion;
  searchText: string;
  highlightMatch: boolean;
  onSelect: (suggestion: AddressSuggestion) => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = memo(({
  suggestion,
  searchText,
  highlightMatch,
  onSelect,
}) => {
  const handlePress = useCallback(() => {
    onSelect(suggestion);
  }, [suggestion, onSelect]);

  // Render address with highlighted matching text
  const renderHighlightedText = () => {
    if (!highlightMatch || !searchText) {
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
// MAIN COMPONENT
// ============================================================================

const InputAddressComponent: React.FC<InputAddressProps> = ({
  value = '',
  placeholder = 'Address',
  suggestions = [],
  maxSuggestions = 5,
  helperText,
  errorText,
  disabled = false,
  onChangeText,
  onSelectSuggestion,
  onFocus,
  onBlur,
  fullWidth = true,
  testID,
  highlightMatch = true,
  _isGrouped = false,
  _groupPosition = 'only',
}) => {
  // Limit suggestions to maxSuggestions
  const limitedSuggestions = suggestions.slice(0, maxSuggestions);
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  // Sync internal value with controlled value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // State flags
  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = currentValue.length > 0;
  const showLabel = hasValue || isFocused;
  const hasError = !!errorText;
  const isDisabled = disabled;
  const showSuggestions = isFocused && limitedSuggestions.length > 0 && !isDisabled;

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

  const handleFocus = useCallback(() => {
    if (!isDisabled) {
      setIsFocused(true);
      onFocus?.();
    }
  }, [isDisabled, onFocus]);

  const handleBlur = useCallback(() => {
    // Delay blur to allow suggestion tap to register
    setTimeout(() => {
      setIsFocused(false);
      onBlur?.();
    }, 150);
  }, [onBlur]);

  const handleChangeText = useCallback((text: string) => {
    setInternalValue(text);
    onChangeText?.(text);
  }, [onChangeText]);

  const handleSelectSuggestion = useCallback((suggestion: AddressSuggestion) => {
    setInternalValue(suggestion.address);
    onChangeText?.(suggestion.address);
    onSelectSuggestion?.(suggestion);
    inputRef.current?.blur();
  }, [onChangeText, onSelectSuggestion]);

  // ============================================================================
  // COMPUTED STYLES
  // ============================================================================

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

  // Get border overlay style for grouped inputs
  const getGroupedBorderOverlay = (): any => {
    const isActive = (hasError || isFocused) && !isDisabled;
    if (!isActive) return null;

    const radius = SPACING.borderRadius;
    const borderColor = hasError ? COLORS.negative : COLORS.primary;
    
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
    const isActive = (hasError || isFocused) && !isDisabled;
    return isActive ? SPACING.paddingHorizontal - 1 : SPACING.paddingHorizontal;
  };

  const getLabelColor = () => {
    if (isDisabled) return COLORS.disabledText;
    return COLORS.subtext;
  };

  const getInputColor = () => {
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

  const inputOpacity = labelAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const inputHeight = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 27],
  });


  // ============================================================================
  // RENDER
  // ============================================================================

  // Grouped inputs render with border overlay (no layout shifts)
  if (_isGrouped) {
    const borderOverlay = getGroupedBorderOverlay();
    
    return (
      <View style={styles.groupedWrapper}>
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
                  value={currentValue}
                  onChangeText={handleChangeText}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder={undefined}
                  editable={!isDisabled}
                  autoCapitalize="words"
                  autoCorrect={false}
                  testID={testID ? `${testID}-input` : undefined}
                />
              </Animated.View>
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* Suggestions Dropdown for grouped - positioned relative to group */}
        {showSuggestions && (
          <View style={[styles.suggestionsContainerGrouped, DROPDOWN_SHADOW]}>
            <ScrollView 
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {limitedSuggestions.map((suggestion) => (
                <SuggestionItem
                  key={suggestion.id}
                  suggestion={suggestion}
                  searchText={currentValue}
                  highlightMatch={highlightMatch}
                  onSelect={handleSelectSuggestion}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.wrapper} testID={testID}>
      {/* Input Container */}
      <TouchableWithoutFeedback onPress={handleContainerPress}>
        <View style={[styles.shadowWrapper, isDisabled ? {} : SHADOW]}>
          <View style={[
            styles.container, 
            fullWidth && styles.fullWidth, 
            getContainerStyle(),
          ]}>
            <View style={[styles.content, { paddingHorizontal: getContentPadding() }]}>
              {placeholder && (
                <Animated.Text
                  style={[styles.label, animatedLabelStyle]}
                  pointerEvents="none"
                >
                  {placeholder}
                </Animated.Text>
              )}
              <Animated.View style={{ opacity: inputOpacity, height: inputHeight, width: '100%', overflow: 'hidden' }}>
                <TextInput
                  ref={inputRef}
                  style={[styles.input, { color: getInputColor() }]}
                  value={currentValue}
                  onChangeText={handleChangeText}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder={undefined}
                  editable={!isDisabled}
                  autoCapitalize="words"
                  autoCorrect={false}
                  testID={testID ? `${testID}-input` : undefined}
                />
              </Animated.View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Suggestions Dropdown - Absolutely positioned */}
      {showSuggestions && (
        <View style={[styles.suggestionsContainer, DROPDOWN_SHADOW]}>
          <ScrollView 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {limitedSuggestions.map((suggestion) => (
              <SuggestionItem
                key={suggestion.id}
                suggestion={suggestion}
                searchText={currentValue}
                highlightMatch={highlightMatch}
                onSelect={handleSelectSuggestion}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Helper Text */}
      {helperText && !showSuggestions && (
        <Text style={[styles.helperText, isDisabled && styles.disabledText]}>
          {helperText}
        </Text>
      )}

      {/* Error Text */}
      {errorText && !showSuggestions && (
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
    zIndex: 100,
    position: 'relative',
  },
  groupedWrapper: {
    width: '100%',
    zIndex: 100,
    position: 'relative',
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  
  // Suggestions dropdown - absolutely positioned below input
  suggestionsContainer: {
    position: 'absolute',
    top: SPACING.height + 4, // 64px input height + 4px gap
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: SPACING.borderRadius,
    maxHeight: SPACING.suggestionItemHeight * 5, // Show max 5 items
    overflow: 'hidden',
    zIndex: 9999,
    elevation: 8, // Android elevation
  },
  // Suggestions dropdown for grouped inputs
  suggestionsContainerGrouped: {
    position: 'absolute',
    top: SPACING.height + 4,
    left: -1, // Align with group border
    right: -1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: SPACING.borderRadius,
    maxHeight: SPACING.suggestionItemHeight * 5,
    overflow: 'hidden',
    zIndex: 9999,
    elevation: 8,
  },
  suggestionItem: {
    height: SPACING.suggestionItemHeight,
    justifyContent: 'center',
    paddingHorizontal: SPACING.paddingHorizontal,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineLow,
    backgroundColor: '#ffffff',
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
});

// ============================================================================
// EXPORT
// ============================================================================

export const InputAddress = memo(InputAddressComponent);
export default InputAddress;

