/**
 * Debug Preview - Button Press State Testing
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../src/components/Button';
import { ChatCircleText } from 'phosphor-react';

export default function DebugApp() {
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [lastPressed, setLastPressed] = useState<string>('None');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🔍 Button Press State Test</Text>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Currently Pressing:</Text>
            <Text style={styles.statusValue}>{pressedButton || 'None'}</Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Last Clicked:</Text>
            <Text style={styles.statusValue}>{lastPressed}</Text>
          </View>
        </View>

        {/* Color Reference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expected Pressed Colors</Text>
          <View style={styles.colorRow}>
            <View style={[styles.colorBox, { backgroundColor: '#0070f3' }]} />
            <Text style={styles.colorText}>Primary Default: #0070f3</Text>
          </View>
          <View style={styles.colorRow}>
            <View style={[styles.colorBox, { backgroundColor: '#2385f8' }]} />
            <Text style={styles.colorText}>Primary Pressed: #2385f8 ⬅️</Text>
          </View>
          
          <View style={styles.colorRow}>
            <View style={[styles.colorBox, { backgroundColor: '#06df79' }]} />
            <Text style={styles.colorText}>Positive Default: #06df79</Text>
          </View>
          <View style={styles.colorRow}>
            <View style={[styles.colorBox, { backgroundColor: '#38e594' }]} />
            <Text style={styles.colorText}>Positive Pressed: #38e594 ⬅️</Text>
          </View>
          
          <View style={styles.colorRow}>
            <View style={[styles.colorBox, { backgroundColor: '#ff2600' }]} />
            <Text style={styles.colorText}>Negative Default: #ff2600</Text>
          </View>
          <View style={styles.colorRow}>
            <View style={[styles.colorBox, { backgroundColor: '#ff5233' }]} />
            <Text style={styles.colorText}>Negative Pressed: #ff5233 ⬅️</Text>
          </View>
        </View>

        {/* Test Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test: Press and Hold</Text>
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackTitle}>✨ Visual Feedback:</Text>
            <Text style={styles.feedbackText}>
              • Color changes (lighter shade){'\n'}
              • Subtle scale animation (99%){'\n'}
              • Smooth spring animation
            </Text>
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              text="Primary Button"
              variant="primary"
              icon={<ChatCircleText size={24} color="#fafafa" weight="regular" />}
              onPress={() => setLastPressed('Primary')}
              fullWidth
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              text="Positive Button"
              variant="positive"
              icon={<ChatCircleText size={24} color="#fafafa" weight="regular" />}
              onPress={() => setLastPressed('Positive')}
              fullWidth
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              text="Negative Button"
              variant="negative"
              icon={<ChatCircleText size={24} color="#fafafa" weight="regular" />}
              onPress={() => setLastPressed('Negative')}
              fullWidth
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              text="Neutral Button"
              variant="neutral"
              icon={<ChatCircleText size={24} color="#fafafa" weight="regular" />}
              onPress={() => setLastPressed('Neutral')}
              fullWidth
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              text="Outline Button"
              variant="outline"
              icon={<ChatCircleText size={24} color="#1d1d1f" weight="regular" />}
              onPress={() => setLastPressed('Outline')}
              fullWidth
            />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>✅ What to Check:</Text>
          <Text style={styles.instructionText}>
            1. Click and HOLD any button{'\n'}
            2. Watch the background color change{'\n'}
            3. Compare to the color swatches above{'\n'}
            4. Color should lighten when pressed{'\n'}
            5. Release to return to default state
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
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    fontWeight: '700',
    color: '#1d1d1f',
    marginBottom: 16,
  },
  statusBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
  },
  statusLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#7d7d7f',
    marginBottom: 4,
  },
  statusValue: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#0070f3',
  },
  section: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: '#1d1d1f',
    marginBottom: 16,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#1d1d1f',
  },
  buttonWrapper: {
    marginBottom: 16,
  },
  feedbackBox: {
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  feedbackTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 8,
  },
  feedbackText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#1976d2',
    lineHeight: 20,
  },
  instructions: {
    padding: 20,
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffc107',
  },
  instructionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#1d1d1f',
    marginBottom: 12,
  },
  instructionText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#1d1d1f',
    lineHeight: 22,
  },
});

