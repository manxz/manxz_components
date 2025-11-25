/**
 * Input Component Preview
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFonts, Nunito_400Regular, Nunito_500Medium, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { ArrowLeft } from 'phosphor-react-native';

// Import components from local directory
import { Input } from './components/Input';
import { COLORS } from './styles/colors';

interface InputPreviewProps {
  onBack: () => void;
}

export default function InputPreview({ onBack }: InputPreviewProps) {
  const [defaultValue, setDefaultValue] = useState('');
  const [filledValue, setFilledValue] = useState('Typed');
  const [errorValue, setErrorValue] = useState('Typed');

  // Load fonts
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Medium': Nunito_500Medium,
    'Nunito-Bold': Nunito_700Bold,
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
            <Text style={styles.title}>Input</Text>
          </View>

          {/* Section: Default State */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Default State</Text>
            
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Placeholder text"
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
              />
            </View>
          </View>

          {/* Section: Active/Focused State */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active/Focused State</Text>
            <Text style={styles.description}>Tap to focus</Text>
            
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Placeholder text"
                defaultValue="Typing"
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
              />
            </View>
          </View>

          {/* Section: Filled State */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filled State</Text>
            
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Placeholder text"
                value={filledValue}
                onChangeText={setFilledValue}
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
              />
            </View>
          </View>

          {/* Section: Error State */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Error State</Text>
            
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Placeholder text"
                value={errorValue}
                onChangeText={setErrorValue}
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
                errorText="If helper text exists, then the error validation text goes under it. Like this."
              />
            </View>
          </View>

          {/* Section: Disabled States */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disabled States</Text>
            
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Placeholder text"
                disabled
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
              />
            </View>

            <View style={styles.inputWrapper}>
              <Input
                placeholder="Placeholder text"
                defaultValue="Typed"
                disabled
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
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
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#7d7d7f',
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 16,
  },
});

