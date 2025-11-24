/**
 * Preview App - Button Component Showcase
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../src/components/Button';
import { ChatCircleText, Check, Trash, Gear, X } from 'phosphor-react';

export default function App() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePress = (variant: string) => {
    console.log(`${variant} button pressed`);
    setLoading(variant);
    setTimeout(() => setLoading(null), 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Button Component Preview</Text>
          <Text style={styles.subtitle}>
            Pixel-perfect React Native buttons from Figma
          </Text>
        </View>

        {/* Section: With Icons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>With Icons</Text>
          
          <View style={styles.button}>
            <Button
              text="Primary Button"
              variant="primary"
              icon={<ChatCircleText size={24} color="#fafafa" weight="regular" />}
              onPress={() => handlePress('primary-icon')}
              loading={loading === 'primary-icon'}
              fullWidth
            />
          </View>

          <View style={styles.button}>
            <Button
              text="Positive Button"
              variant="positive"
              icon={<Check size={24} color="#fafafa" weight="bold" />}
              onPress={() => handlePress('positive-icon')}
              loading={loading === 'positive-icon'}
              fullWidth
            />
          </View>

          <View style={styles.button}>
            <Button
              text="Negative Button"
              variant="negative"
              icon={<Trash size={24} color="#fafafa" weight="regular" />}
              onPress={() => handlePress('negative-icon')}
              loading={loading === 'negative-icon'}
              fullWidth
            />
          </View>

          <View style={styles.button}>
            <Button
              text="Neutral Button"
              variant="neutral"
              icon={<Gear size={24} color="#fafafa" weight="regular" />}
              onPress={() => handlePress('neutral-icon')}
              loading={loading === 'neutral-icon'}
              fullWidth
            />
          </View>

          <View style={styles.button}>
            <Button
              text="Outline Button"
              variant="outline"
              icon={<X size={24} color="#1d1d1f" weight="regular" />}
              onPress={() => handlePress('outline-icon')}
              loading={loading === 'outline-icon'}
              fullWidth
            />
          </View>
        </View>

        {/* Section: Without Icons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Without Icons</Text>
          
          <View style={styles.button}>
            <Button
              text="Primary Button"
              variant="primary"
              onPress={() => handlePress('primary')}
              loading={loading === 'primary'}
              fullWidth
            />
          </View>

          <View style={styles.button}>
            <Button
              text="Positive Button"
              variant="positive"
              onPress={() => handlePress('positive')}
              loading={loading === 'positive'}
              fullWidth
            />
          </View>

          <View style={styles.button}>
            <Button
              text="Negative Button"
              variant="negative"
              onPress={() => handlePress('negative')}
              loading={loading === 'negative'}
              fullWidth
            />
          </View>

          <View style={styles.button}>
            <Button
              text="Neutral Button"
              variant="neutral"
              onPress={() => handlePress('neutral')}
              loading={loading === 'neutral'}
              fullWidth
            />
          </View>

          <View style={styles.button}>
            <Button
              text="Outline Button"
              variant="outline"
              onPress={() => handlePress('outline')}
              loading={loading === 'outline'}
              fullWidth
            />
          </View>
        </View>

        {/* Section: States */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>States</Text>
          
          <View style={styles.button}>
            <Button
              text="Disabled Button"
              variant="primary"
              disabled
              fullWidth
            />
          </View>

          <View style={styles.button}>
            <Button
              text="Loading State"
              variant="primary"
              loading
              fullWidth
            />
          </View>

          <View style={styles.button}>
            <Button
              text="Disabled with Icon"
              variant="primary"
              icon={<ChatCircleText size={24} color="#7d7d7f" weight="regular" />}
              disabled
              fullWidth
            />
          </View>
        </View>

        {/* Section: Sizes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Width Options</Text>
          
          <View style={styles.button}>
            <Button
              text="Full Width"
              variant="primary"
              fullWidth
            />
          </View>

          <View style={styles.row}>
            <Button
              text="Auto Width"
              variant="primary"
              onPress={() => console.log('Auto width')}
            />
          </View>
        </View>

        {/* Interactive Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interactive Demo</Text>
          <Text style={styles.instructions}>
            Click any button above to see loading state for 2 seconds
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1f',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: '#7d7d7f',
  },
  section: {
    marginBottom: 40,
  },
  button: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: '#1d1d1f',
    marginBottom: 8,
  },
  instructions: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#7d7d7f',
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

