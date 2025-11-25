/**
 * useInput Hook
 * Headless logic for Input component interactions and state management
 * 
 * @returns Input state and handlers for focus, blur, and value changes
 */

import { useState, useCallback } from 'react';

export interface UseInputProps {
  /** Initial value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Callback fired when input value changes */
  onChangeText?: (text: string) => void;
  /** Callback fired when input receives focus */
  onFocus?: () => void;
  /** Callback fired when input loses focus */
  onBlur?: () => void;
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
  handleFocus: () => void;
  /** Handle blur event */
  handleBlur: () => void;
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

  const handleFocus = useCallback(() => {
    if (!disabled) {
      setIsFocused(true);
      onFocus?.();
    }
  }, [disabled, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  return {
    value,
    isFocused,
    hasValue,
    handleChangeText,
    handleFocus,
    handleBlur,
  };
};

