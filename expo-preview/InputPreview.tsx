/**
 * Input Component Preview
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFonts, Nunito_400Regular, Nunito_500Medium, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { ArrowLeft } from 'phosphor-react-native';

// Import components from local directory
import { Input, InputSplit, InputSelect, InputGroup } from './components/Input';
import { COLORS } from './styles/colors';

// Sample options for InputSelect
const countryOptions = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'Mexico', value: 'mx' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Spain', value: 'es' },
  { label: 'Italy', value: 'it' },
];

const categoryOptions = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Food & Beverage', value: 'food' },
  { label: 'Home & Garden', value: 'home' },
];

interface InputPreviewProps {
  onBack: () => void;
}

export default function InputPreview({ onBack }: InputPreviewProps) {
  const [filledValue, setFilledValue] = useState('Typed');
  const [errorValue, setErrorValue] = useState('Typed');
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
  const [selectedCountryFilled, setSelectedCountryFilled] = useState<string>('us');
  const [selectedCountryError, setSelectedCountryError] = useState<string>('uk');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

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
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
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

          {/* Section: Split Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Split Input</Text>
            <Text style={styles.description}>Two inputs side by side</Text>
            
            <View style={styles.inputWrapper}>
              <InputSplit
                leftPlaceholder="Quantity"
                rightPlaceholder="Price"
              />
            </View>

            <View style={styles.inputWrapper}>
              <InputSplit
                leftPlaceholder="Quantity"
                leftDefaultValue="10"
                rightPlaceholder="Price"
              />
            </View>
          </View>

          {/* Section: Input Group */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Group</Text>
            <Text style={styles.description}>Stacked inputs with dividers</Text>
            
            <View style={styles.inputWrapper}>
              <InputGroup>
                <Input placeholder="Line item" />
                <InputSplit
                  leftPlaceholder="Quantity"
                  rightPlaceholder="Price"
                />
              </InputGroup>
            </View>

            <View style={styles.inputWrapper}>
              <InputGroup>
                <Input placeholder="Full name" />
                <Input placeholder="Email address" />
                <Input placeholder="Phone number" />
              </InputGroup>
            </View>
          </View>

          {/* Section: Input Select */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Select</Text>
            <Text style={styles.description}>Opens a modal picker on tap</Text>
            
            <View style={styles.inputWrapper}>
              <InputSelect
                placeholder="Placeholder text"
                options={countryOptions}
                value={selectedCountry}
                onChange={setSelectedCountry}
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
              />
            </View>

            <View style={styles.inputWrapper}>
              <InputSelect
                placeholder="Placeholder text"
                options={countryOptions}
                value={selectedCountryFilled}
                onChange={setSelectedCountryFilled}
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
              />
            </View>
          </View>

          {/* Section: Input Select Error */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Select - Error</Text>
            
            <View style={styles.inputWrapper}>
              <InputSelect
                placeholder="Placeholder text"
                options={countryOptions}
                value={selectedCountryError}
                onChange={setSelectedCountryError}
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
                errorText="If helper text exists, then the error validation text goes under it. Like this."
              />
            </View>
          </View>

          {/* Section: Input Select Disabled */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Select - Disabled</Text>
            
            <View style={styles.inputWrapper}>
              <InputSelect
                placeholder="Placeholder text"
                options={countryOptions}
                disabled
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
              />
            </View>

            <View style={styles.inputWrapper}>
              <InputSelect
                placeholder="Placeholder text"
                options={countryOptions}
                value="ca"
                disabled
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
              />
            </View>
          </View>

          {/* Section: Input Select in Group */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Select in Group</Text>
            <Text style={styles.description}>Combined with other inputs</Text>
            
            <View style={styles.inputWrapper}>
              <InputGroup>
                <Input placeholder="Product name" />
                <InputSelect
                  placeholder="Category"
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                />
                <InputSplit
                  leftPlaceholder="Quantity"
                  rightPlaceholder="Price"
                />
              </InputGroup>
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
    paddingBottom: 400, // Extra space so content is visible above keyboard
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
