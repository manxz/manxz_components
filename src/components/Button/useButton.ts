/**
 * useButton Hook
 * Headless logic for Button component interactions and state management
 * 
 * @returns Button state and handlers for press events
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { GestureResponderEvent, Animated } from 'react-native';

export interface UseButtonProps {
  /** Callback fired when button is pressed */
  onPress?: (event: GestureResponderEvent) => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Enable scale animation on press */
  scaleAnimation?: boolean;
}

export interface UseButtonReturn {
  /** Whether button is currently being pressed */
  isPressed: boolean;
  /** Handle press in event */
  handlePressIn: () => void;
  /** Handle press out event */
  handlePressOut: () => void;
  /** Handle press event */
  handlePress: (event: GestureResponderEvent) => void;
  /** Whether interactions should be blocked */
  isInteractionDisabled: boolean;
  /** Animated scale value for press feedback */
  scaleValue: Animated.Value;
}

export const useButton = ({
  onPress,
  disabled = false,
  loading = false,
  scaleAnimation = true,
}: UseButtonProps): UseButtonReturn => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    if (!disabled && !loading) {
      setIsPressed(true);
      
      // Animate scale down for tactile feedback
      if (scaleAnimation) {
        Animated.spring(scaleValue, {
          toValue: 0.99,
          useNativeDriver: true,
          speed: 50,
          bounciness: 0,
        }).start();
      }
    }
  }, [disabled, loading, scaleAnimation, scaleValue]);

  const handlePressOut = useCallback(() => {
    setIsPressed(false);
    
    // Animate scale back to normal
    if (scaleAnimation) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }
  }, [scaleAnimation, scaleValue]);

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (!disabled && !loading && onPress) {
        onPress(event);
      }
    },
    [disabled, loading, onPress]
  );

  const isInteractionDisabled = disabled || loading;

  // Reset scale when disabled/loading
  useEffect(() => {
    if (isInteractionDisabled) {
      scaleValue.setValue(1);
      setIsPressed(false);
    }
  }, [isInteractionDisabled, scaleValue]);

  return {
    isPressed,
    handlePressIn,
    handlePressOut,
    handlePress,
    isInteractionDisabled,
    scaleValue,
  };
};

