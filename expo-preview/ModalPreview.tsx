/**
 * Modal Component Preview
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFonts, Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { ArrowLeft, Phone, ArrowsClockwise } from 'phosphor-react-native';

// Import components from local directory
import { Modal } from './components/Modal';
import { Button } from './components/Button';
import { COLORS } from './styles/colors';

interface ModalPreviewProps {
  onBack: () => void;
}

export default function ModalPreview({ onBack }: ModalPreviewProps) {
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Bold': Nunito_700Bold,
    'Nunito-ExtraBold': Nunito_800ExtraBold,
  });

  // Show loading screen while fonts load
  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading fonts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
              <ArrowLeft size={24} color={COLORS.onSurface} weight="regular" />
            </TouchableOpacity>
            <Text style={styles.title}>Modal</Text>
          </View>

          {/* Section: Modal Demo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bottom Sheet Modal</Text>
            <Text style={styles.description}>
              Tap the button below to see the modal slide up from the bottom with a bounce animation.
            </Text>

            <View style={styles.buttonWrapper}>
              <Button
                text="Show Help Modal"
                variant="primary"
                onPress={() => setShowHelpModal(true)}
                fullWidth
              />
            </View>
          </View>
        </View>

        {/* Help Modal */}
        <Modal
          visible={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          title="Help"
        >
          <Button
            text="Call me instead"
            variant="outline"
            icon={<Phone size={24} color={COLORS.onSurface} weight="regular" />}
            onPress={() => {
              console.log('Call me instead pressed');
              setShowHelpModal(false);
            }}
            fullWidth
          />
          <Button
            text="Resend code"
            variant="outline"
            icon={<ArrowsClockwise size={24} color={COLORS.onSurface} weight="regular" />}
            onPress={() => {
              console.log('Resend code pressed');
              setShowHelpModal(false);
            }}
            fullWidth
          />
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7d7d7f',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 16,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1f',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: '#1d1d1f',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#7d7d7f',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonWrapper: {
    marginBottom: 16,
  },
});
