/**
 * Component List Screen
 * Shows all available components to preview
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { ArrowRight } from 'phosphor-react-native';

interface ComponentItem {
  id: string;
  name: string;
}

interface ComponentListProps {
  components: ComponentItem[];
  onSelectComponent: (componentId: string) => void;
}

const ComponentList: React.FC<ComponentListProps> = ({ components, onSelectComponent }) => {
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Bold': Nunito_700Bold,
  });

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
          <View style={styles.header}>
            <Text style={styles.title}>Manxz Components</Text>
            <Text style={styles.subtitle}>Component Library Preview</Text>
          </View>

          <View style={styles.list}>
            {components.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.item, index === components.length - 1 && { marginBottom: 0 }]}
                onPress={() => onSelectComponent(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <ArrowRight size={24} color="#7d7d7f" weight="regular" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    marginBottom: 32,
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
  list: {
    gap: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(29, 29, 31, 0.1)',
    marginBottom: 12,
  },
  itemName: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#1d1d1f',
  },
});

export default ComponentList;

