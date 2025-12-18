/**
 * useModal Hook
 * Headless logic for Modal component animations and state management
 *
 * Features:
 * - Slide-up animation from bottom with spring bounce
 * - Overlay fade animation
 * - Controlled visibility state
 *
 * @returns Modal state, animation values, and handlers
 */

import { useRef, useCallback, useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface UseModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when modal requests to close (e.g., overlay tap) */
  onClose?: () => void;
  /** Animation duration in ms (default: 300) */
  animationDuration?: number;
}

export interface UseModalReturn {
  /** Animated value for slide translation (0 = visible, SCREEN_HEIGHT = hidden) */
  translateY: Animated.Value;
  /** Animated value for overlay opacity (0 = transparent, 1 = visible) */
  overlayOpacity: Animated.Value;
  /** Handle overlay press to close */
  handleOverlayPress: () => void;
  /** Whether modal content should render */
  shouldRender: boolean;
}

export const useModal = ({
  visible,
  onClose,
  animationDuration = 300,
}: UseModalProps): UseModalReturn => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const shouldRenderRef = useRef(visible);

  // Track if we should render (stays true during close animation)
  if (visible) {
    shouldRenderRef.current = true;
  }

  useEffect(() => {
    if (visible) {
      // Animate in: slide up with bounce
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 200,
          mass: 0.8,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out: slide down
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After animation completes, allow unmount
        shouldRenderRef.current = false;
      });
    }
  }, [visible, translateY, overlayOpacity, animationDuration]);

  const handleOverlayPress = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return {
    translateY,
    overlayOpacity,
    handleOverlayPress,
    shouldRender: visible || shouldRenderRef.current,
  };
};
