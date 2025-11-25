/**
 * Button Component - Usage Examples
 * 
 * Copy these examples into your app to see the Button in action
 */

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from './Button';
import { ChatCircleText, Check, Trash } from 'phosphor-react-native';

export const ButtonExamples = () => {
  const handlePress = () => {
    Alert.alert('Button Pressed', 'You pressed the button!');
  };

  return (
    <View style={styles.container}>
      {/* Primary Button with Icon */}
      <Button
        text="Continue"
        variant="primary"
        icon={<ChatCircleText size={24} color="#fafafa" weight="regular" />}
        onPress={handlePress}
        fullWidth
      />

      {/* Positive Button */}
      <Button
        text="Confirm"
        variant="positive"
        icon={<Check size={24} color="#fafafa" weight="bold" />}
        onPress={handlePress}
        fullWidth
      />

      {/* Negative Button */}
      <Button
        text="Delete"
        variant="negative"
        icon={<Trash size={24} color="#fafafa" weight="regular" />}
        onPress={handlePress}
        fullWidth
      />

      {/* Neutral Button */}
      <Button
        text="Settings"
        variant="neutral"
        onPress={handlePress}
        fullWidth
      />

      {/* Outline Button */}
      <Button
        text="Cancel"
        variant="outline"
        onPress={handlePress}
        fullWidth
      />

      {/* Disabled Button */}
      <Button
        text="Disabled"
        variant="primary"
        disabled
        fullWidth
      />

      {/* Loading Button */}
      <Button
        text="Loading..."
        variant="primary"
        loading
        fullWidth
      />

      {/* Button without fullWidth */}
      <View style={styles.row}>
        <Button
          text="Compact Button"
          variant="primary"
          onPress={handlePress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});
