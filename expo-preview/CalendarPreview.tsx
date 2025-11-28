/**
 * Calendar Component Preview
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFonts, Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { ArrowLeft } from 'phosphor-react-native';

import { Calendar, CalendarWeek } from './components/Calendar';
import { COLORS } from './styles/colors';

interface CalendarPreviewProps {
  onBack: () => void;
}

export default function CalendarPreview({ onBack }: CalendarPreviewProps) {
  // State for CalendarWeek
  const [weekSelectedDate, setWeekSelectedDate] = useState<Date>(new Date());

  // Sample highlighted dates (e.g., available dates)
  const highlightedDates = [
    new Date(2024, 5, 2),
    new Date(2024, 5, 3),
    new Date(2024, 5, 4),
    new Date(2024, 5, 5),
    new Date(2024, 5, 6),
    new Date(2024, 5, 9),
    new Date(2024, 5, 10),
    new Date(2024, 5, 12),
    new Date(2024, 5, 17),
    new Date(2024, 5, 20),
    new Date(2024, 5, 26),
    new Date(2024, 5, 31),
  ];

  // Load fonts
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Medium': Nunito_500Medium,
    'Nunito-SemiBold': Nunito_600SemiBold,
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
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
              <ArrowLeft size={24} color={COLORS.onSurface} weight="regular" />
            </TouchableOpacity>
            <Text style={styles.title}>Calendar</Text>
          </View>

          {/* Section: Default Calendar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Default Calendar</Text>
            <Text style={styles.description}>Blue circle indicates today, gray background shows highlighted dates</Text>
            
            <View style={styles.calendarWrapper}>
              <Calendar
                highlightedDates={highlightedDates}
                onSelectDate={(date) => console.log('Date tapped:', date)}
              />
            </View>
          </View>

          {/* Section: Custom Today */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Today Date</Text>
            <Text style={styles.description}>June 25th set as "today"</Text>
            
            <View style={styles.calendarWrapper}>
              <Calendar
                today={new Date(2024, 5, 25)}
                highlightedDates={highlightedDates}
                onSelectDate={(date) => console.log('Date tapped:', date)}
              />
            </View>
          </View>

          {/* Section: Calendar Week */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Calendar Week</Text>
            <Text style={styles.description}>Swipe left/right to change weeks. Black = selected, gray = today</Text>
            
            <View style={styles.calendarWrapper}>
              <CalendarWeek
                selectedDate={weekSelectedDate}
                onSelectDate={setWeekSelectedDate}
                onWeekChange={(weekStart) => console.log('Week changed:', weekStart)}
              />
            </View>
          </View>

          {/* Section: Disabled */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disabled</Text>
            <Text style={styles.description}>Non-interactive calendar</Text>
            
            <View style={styles.calendarWrapper}>
              <Calendar
                disabled
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
    paddingBottom: 100,
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
  calendarWrapper: {
    marginBottom: 16,
  },
});

