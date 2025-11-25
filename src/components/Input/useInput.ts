/**
 * useInput Hook
 * Headless logic for Input component interactions and state management
 * 
 * @returns Input state and handlers for focus, blur, and value changes
 */

import { useState, useCallback } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

export interface UseInputProps {
  /** Initial value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Callback fired when input value changes */
  onChangeText?: (text: string) => void;
  /** Callback fired when input receives focus */
  onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  /** Callback fired when input loses focus */
  onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  /** Whether the input is disabled */
  disabled?: boolean;
}

export interface UseInputReturn {
  /** Current input value */
  value: string;
  /** Whether input is currently focused */
  isFocused: boolean;
  /** Whether input has a value */
  hasValue: boolean;
  /** Handle text change */
  handleChangeText: (text: string) => void;
  /** Handle focus event */
  handleFocus: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  /** Handle blur event */
  handleBlur: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}

export const useInput = ({
  value: controlledValue,
  defaultValue = '',
  onChangeText,
  onFocus,
  onBlur,
  disabled = false,
}: UseInputProps): UseInputReturn => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;
  const hasValue = value.length > 0;

  const handleChangeText = useCallback(
    (text: string) => {
      if (!disabled) {
        if (controlledValue === undefined) {
          setUncontrolledValue(text);
        }
        onChangeText?.(text);
      }
    },
    [disabled, controlledValue, onChangeText]
  );

  const handleFocus = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (!disabled) {
        setIsFocused(true);
        onFocus?.(event);
      }
    },
    [disabled, onFocus]
  );

  const handleBlur = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur]
  );

  return {
    value,
    isFocused,
    hasValue,
    handleChangeText,
    handleFocus,
    handleBlur,
  };
};

