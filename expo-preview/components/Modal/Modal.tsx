/**
 * Modal Component
 *
 * Description:
 * A bottom sheet modal that slides up from the bottom with a spring bounce animation.
 * Displays an overlay backdrop and supports customizable content.
 *
 * Props:
 * - visible: boolean — Controls modal visibility (required)
 * - onClose: () => void — Callback when modal requests to close (overlay tap)
 * - title: string — Optional title displayed at the top of the modal
 * - children: React.ReactNode — Content to render inside the modal
 * - testID: string — Test identifier for testing
 *
 * States supported:
 * - open: Modal is visible with slide-up animation and overlay
 * - closed: Modal is hidden with slide-down animation
 *
 * Usage example:
 * <Modal
 *   visible={showHelp}
 *   onClose={() => setShowHelp(false)}
 *   title="Help"
 * >
 *   <Button text="Call me instead" icon={<PhoneIcon />} onPress={handleCall} />
 *   <Button text="Resend code" icon={<RefreshIcon />} onPress={handleResend} />
 * </Modal>
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Modal as RNModal,
} from 'react-native';
import { useModal } from './useModal';
import { TYPOGRAPHY } from '../../styles/typography';
import { COLORS } from '../../styles/colors';

// ============================================================================
// TYPES
// ============================================================================

export interface ModalProps {
  /** Controls modal visibility */
  visible: boolean;
  /** Callback when modal requests to close (e.g., overlay tap) */
  onClose?: () => void;
  /** Optional title displayed at the top */
  title?: string;
  /** Content to render inside the modal */
  children?: React.ReactNode;
  /** Test identifier */
  testID?: string;
}

// ============================================================================
// DESIGN TOKENS
// ============================================================================

const SPACING = {
  borderRadiusTop: 24,
  paddingHorizontal: 24,
  paddingTop: 32,
  paddingBottom: 40,
  titleMarginBottom: 24,
  childrenGap: 16,
};

const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.4)';

// ============================================================================
// COMPONENT
// ============================================================================

const ModalComponent: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  testID,
}) => {
  const {
    translateY,
    overlayOpacity,
    handleOverlayPress,
    shouldRender,
  } = useModal({ visible, onClose });

  if (!shouldRender && !visible) {
    return null;
  }

  return (
    <RNModal
      visible={visible || shouldRender}
      transparent
      animationType="none"
      statusBarTranslucent
      testID={testID}
      onRequestClose={onClose}
    >
      <View style={styles.wrapper}>
        {/* Overlay */}
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet Content */}
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          {title && <Text style={styles.title}>{title}</Text>}
          <View style={styles.content}>
            {React.Children.map(children, (child, index) => (
              <View
                key={index}
                style={index > 0 ? styles.childSpacing : undefined}
              >
                {child}
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </RNModal>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: OVERLAY_COLOR,
  },
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SPACING.borderRadiusTop,
    borderTopRightRadius: SPACING.borderRadiusTop,
    paddingHorizontal: SPACING.paddingHorizontal,
    paddingTop: SPACING.paddingTop,
    paddingBottom: SPACING.paddingBottom,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.titleMarginBottom,
  },
  content: {
    width: '100%',
  },
  childSpacing: {
    marginTop: SPACING.childrenGap,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export const Modal = memo(ModalComponent);
export default Modal;
