/**
 * Input Component Preview
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFonts, Nunito_400Regular, Nunito_500Medium, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { ArrowLeft } from 'phosphor-react-native';

// Import components from local directory
import { Input, InputSplit, InputSelect, InputAddress, InputRadio, InputBank, InputMenu, InputGroup } from './components/Input';
import type { BankAccount } from './components/Input';
import type { AddressSuggestion } from './components/Input';
import { COLORS } from './styles/colors';

// Mock address suggestions (in real app, fetch from Google Places API)
const mockAddressSuggestions: AddressSuggestion[] = [
  { id: '1', address: '8689 Velma Ln., Tracy, CA' },
  { id: '2', address: '8689 Velma Ave., Lamont, CA' },
  { id: '3', address: '8689 Velma Way, Sacramento, CA' },
  { id: '4', address: '8689 Velma Rd., Hopedale, IL' },
  { id: '5', address: '8689 Velma Ave., Santa Rosa, CA' },
];

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
  
  // InputAddress state
  const [addressValue, setAddressValue] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [filledAddress] = useState('8689 Velma Ln., Tracy, CA');
  const [errorAddress] = useState('8689 Velma Ln., Tracy, CA');

  // InputRadio state
  const [selectedRadio, setSelectedRadio] = useState<string>('option2');

  // Chase logo component for preview (approximates the Chase octagon logo)
  const ChaseLogo = () => (
    <View style={{ width: 26, height: 26, position: 'relative' }}>
      {/* Top blade */}
      <View style={{ position: 'absolute', top: 0, left: 9, width: 8, height: 13, backgroundColor: '#fff', borderRadius: 1 }} />
      {/* Right blade */}
      <View style={{ position: 'absolute', top: 9, right: 0, width: 13, height: 8, backgroundColor: '#fff', borderRadius: 1 }} />
      {/* Bottom blade */}
      <View style={{ position: 'absolute', bottom: 0, right: 9, width: 8, height: 13, backgroundColor: '#fff', borderRadius: 1 }} />
      {/* Left blade */}
      <View style={{ position: 'absolute', bottom: 9, left: 0, width: 13, height: 8, backgroundColor: '#fff', borderRadius: 1 }} />
    </View>
  );

  // InputBank mock data
  const connectedBank: BankAccount = {
    name: 'Chase Bank',
    logoComponent: <ChaseLogo />,
    logoBackgroundColor: '#004fc2',
    routingNumber: '028000212',
    cardLastFour: '5671',
  };

  // Simulate fetching address suggestions (called when typing in modal)
  const handleAddressSearch = (text: string) => {
    // Show suggestions when typing (in real app, debounce and call API)
    if (text.length >= 3) {
      // Filter mock suggestions to match input
      const filtered = mockAddressSuggestions.filter(s => 
        s.address.toLowerCase().includes(text.toLowerCase())
      );
      setAddressSuggestions(filtered.length > 0 ? filtered : mockAddressSuggestions);
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleSelectAddress = (address: string) => {
    setAddressValue(address);
    setAddressSuggestions([]);
  };

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

          {/* Section: Input Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Address</Text>
            <Text style={styles.description}>Opens modal with search (type "8689")</Text>
            
            <View style={styles.inputWrapper}>
              <InputAddress
                placeholder="Address"
                value={addressValue}
                suggestions={addressSuggestions}
                onChangeText={handleAddressSearch}
                onSelectAddress={handleSelectAddress}
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
              />
            </View>
          </View>

          {/* Section: Input Address Filled */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Address - Filled</Text>
            
            <View style={styles.inputWrapper}>
              <InputAddress
                placeholder="Address"
                value={filledAddress}
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
              />
            </View>
          </View>

          {/* Section: Input Address Error */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Address - Error</Text>
            
            <View style={styles.inputWrapper}>
              <InputAddress
                placeholder="Address"
                value={errorAddress}
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
                errorText="If helper text exists, then the error validation text goes under it. Like this."
              />
            </View>
          </View>

          {/* Section: Input Address Disabled */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Address - Disabled</Text>
            
            <View style={styles.inputWrapper}>
              <InputAddress
                placeholder="Address"
                disabled
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
              />
            </View>

            <View style={styles.inputWrapper}>
              <InputAddress
                placeholder="Address"
                value="8689 Velma Ln., Tracy, CA"
                disabled
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
              />
            </View>
          </View>

          {/* Section: Input Address in Group */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Address in Group</Text>
            <Text style={styles.description}>Combined with other inputs</Text>
            
            <View style={styles.inputWrapper}>
              <InputGroup>
                <Input placeholder="Full name" />
                <InputAddress
                  placeholder="Address"
                  value={addressValue}
                  suggestions={addressSuggestions}
                  onChangeText={handleAddressSearch}
                  onSelectAddress={handleSelectAddress}
                />
                <Input placeholder="Phone number" />
              </InputGroup>
            </View>
          </View>

          {/* Section: Input Radio in Group */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Radio in Group</Text>
            <Text style={styles.description}>Single selection from multiple options</Text>
            
            <View style={styles.inputWrapper}>
              <InputGroup
                helperText="This text helper is optional and can span as many lines as needed. But keep it short."
              >
                <InputRadio
                  label="Option 1"
                  selected={selectedRadio === 'option1'}
                  onPress={() => setSelectedRadio('option1')}
                />
                <InputRadio
                  label="Option 2"
                  selected={selectedRadio === 'option2'}
                  onPress={() => setSelectedRadio('option2')}
                />
                <InputRadio
                  label="Option 3"
                  selected={selectedRadio === 'option3'}
                  onPress={() => setSelectedRadio('option3')}
                />
              </InputGroup>
            </View>
          </View>

          {/* Section: Input Radio States */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Radio States</Text>
            <Text style={styles.description}>All possible radio states</Text>
            
            <View style={styles.inputWrapper}>
              <InputGroup>
                <InputRadio
                  label="Default (unselected)"
                  selected={false}
                  onPress={() => {}}
                />
                <InputRadio
                  label="Selected"
                  selected={true}
                  onPress={() => {}}
                />
                <InputRadio
                  label="Error state"
                  selected={false}
                  errorText="This option has an error"
                  onPress={() => {}}
                />
                <InputRadio
                  label="Disabled"
                  selected={false}
                  disabled
                  onPress={() => {}}
                />
              </InputGroup>
            </View>
          </View>

          {/* Section: Input Bank Empty */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Bank - Empty</Text>
            <Text style={styles.description}>No bank connected</Text>
            
            <View style={styles.inputWrapper}>
              <InputBank
                onPress={() => console.log('Connect bank pressed')}
                helperText="This is the account where you want to receive payments from your customers"
              />
            </View>
          </View>

          {/* Section: Input Bank Filled */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Bank - Filled</Text>
            <Text style={styles.description}>Bank account connected</Text>
            
            <View style={styles.inputWrapper}>
              <InputBank
                bank={connectedBank}
                onPress={() => console.log('Change bank pressed')}
              />
            </View>
          </View>

          {/* Section: Input Bank States */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Bank States</Text>
            <Text style={styles.description}>Error and disabled states</Text>
            
            <View style={styles.inputWrapper}>
              <InputBank
                bank={connectedBank}
                errorText="There was an issue with this bank account"
                onPress={() => {}}
              />
            </View>

            <View style={[styles.inputWrapper, { marginTop: 16 }]}>
              <InputBank
                disabled
                onPress={() => {}}
              />
            </View>
          </View>

          {/* Section: Input Menu */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Menu</Text>
            <Text style={styles.description}>Navigation rows for settings</Text>
            
            <View style={styles.inputWrapper}>
              <InputGroup>
                <InputMenu 
                  label="Account Settings" 
                  onPress={() => console.log('Account Settings')} 
                />
                <InputMenu 
                  label="Notifications" 
                  onPress={() => console.log('Notifications')} 
                />
                <InputMenu 
                  label="Privacy & Security" 
                  onPress={() => console.log('Privacy')} 
                />
              </InputGroup>
            </View>
          </View>

          {/* Section: Input Menu Single */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Menu - Single</Text>
            <Text style={styles.description}>Standalone menu item</Text>
            
            <View style={styles.inputWrapper}>
              <InputMenu 
                label="Logout" 
                onPress={() => console.log('Logout')} 
              />
            </View>

            <View style={[styles.inputWrapper, { marginTop: 16 }]}>
              <InputMenu 
                label="Disabled Item" 
                disabled
                onPress={() => {}} 
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
