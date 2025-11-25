/**
 * Button Component Preview
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFonts, Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { ChatCircleText, Check, Trash, Gear, X, ArrowLeft } from 'phosphor-react-native';

// Import components from local directory
import { Button } from './components/Button';
import { COLORS } from './styles/colors';

interface ButtonPreviewProps {
  onBack: () => void;
}

export default function ButtonPreview({ onBack }: ButtonPreviewProps) {
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
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
              <ArrowLeft size={24} color={COLORS.onSurface} weight="regular" />
            </TouchableOpacity>
            <Text style={styles.title}>Button</Text>
          </View>

          {/* Section: With Icons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>With Icons</Text>
            
            <View style={styles.buttonWrapper}>
              <Button
                text="Primary Button"
                variant="primary"
                icon={<ChatCircleText size={24} color={COLORS.surface} weight="regular" />}
                onPress={() => console.log('Primary button pressed')}
                fullWidth
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                text="Positive Button"
                variant="positive"
                icon={<Check size={24} color={COLORS.surface} weight="bold" />}
                onPress={() => console.log('Positive button pressed')}
                fullWidth
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                text="Negative Button"
                variant="negative"
                icon={<Trash size={24} color={COLORS.surface} weight="regular" />}
                onPress={() => console.log('Negative button pressed')}
                fullWidth
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                text="Neutral Button"
                variant="neutral"
                icon={<Gear size={24} color={COLORS.surface} weight="regular" />}
                onPress={() => console.log('Neutral button pressed')}
                fullWidth
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                text="Outline Button"
                variant="outline"
                icon={<X size={24} color={COLORS.onSurface} weight="regular" />}
                onPress={() => console.log('Outline button pressed')}
                fullWidth
              />
            </View>
          </View>

          {/* Section: Without Icons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Without Icons</Text>
            
            <View style={styles.buttonWrapper}>
              <Button
                text="Primary Button"
                variant="primary"
                onPress={() => console.log('Primary button pressed')}
                fullWidth
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                text="Positive Button"
                variant="positive"
                onPress={() => console.log('Positive button pressed')}
                fullWidth
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                text="Negative Button"
                variant="negative"
                onPress={() => console.log('Negative button pressed')}
                fullWidth
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                text="Neutral Button"
                variant="neutral"
                onPress={() => console.log('Neutral button pressed')}
                fullWidth
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                text="Outline Button"
                variant="outline"
                onPress={() => console.log('Outline button pressed')}
                fullWidth
              />
            </View>
          </View>

          {/* Section: States */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>States</Text>
            
            <View style={styles.buttonWrapper}>
              <Button
                text="Disabled Button"
                variant="primary"
                disabled
                fullWidth
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                text="Loading State"
                variant="primary"
                loading
                fullWidth
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                text="Disabled with Icon"
                variant="primary"
                icon={<ChatCircleText size={24} color={COLORS.subtext} weight="regular" />}
                disabled
                fullWidth
              />
            </View>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 16,
  },
  buttonWrapper: {
    marginBottom: 16,
  },
});

