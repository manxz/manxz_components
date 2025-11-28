/**
 * CalendarWeek Component
 *
 * A horizontal week strip calendar with native swipe navigation.
 * Pre-loads multiple weeks for smooth, flash-free swiping.
 *
 * @example
 * ```tsx
 * <CalendarWeek
 *   selectedDate={selectedDate}
 *   onSelectDate={(date) => setSelectedDate(date)}
 *   onWeekChange={(weekStart) => console.log('Week:', weekStart)}
 * />
 * ```
 */

import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { COLORS } from '../../styles/colors';
import { FONT_FAMILIES, FONT_WEIGHTS, FONT_SIZES } from '../../styles/typography';

// ============================================================================
// CONSTANTS
// ============================================================================

const SCREEN_WIDTH = Dimensions.get('window').width;
const WEEKS_BUFFER = 5;
const TOTAL_WEEKS = WEEKS_BUFFER * 2 + 1;
const CENTER_INDEX = WEEKS_BUFFER;
const WEEKDAYS = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'] as const;

// ============================================================================
// TYPES
// ============================================================================

export interface CalendarWeekProps {
  /** Currently selected date (shown with black/blue circle) */
  selectedDate?: Date | null;
  /** Override for "today" - defaults to current date */
  today?: Date;
  /** Callback when a date is selected */
  onSelectDate?: (date: Date) => void;
  /** Callback when the visible week changes via swipe */
  onWeekChange?: (weekStart: Date) => void;
  /** Disable all interactions */
  disabled?: boolean;
  /** Test identifier for automation */
  testID?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

/** Check if two dates are the same day */
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/** Check if day index is a weekend (Sunday=0, Saturday=6) */
const isWeekend = (dayIndex: number): boolean => dayIndex === 0 || dayIndex === 6;

/** Generate array of 7 dates starting from startDate */
const getWeekDates = (startDate: Date): Date[] => {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i));
  }
  return dates;
};

/** Get the Sunday of the week containing the given date */
const getWeekStart = (date: Date): Date => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d;
};

// ============================================================================
// DAY COLUMN COMPONENT
// ============================================================================

interface DayColumnProps {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  disabled: boolean;
  onPress: (date: Date) => void;
}

const DayColumn = memo<DayColumnProps>(({
  date,
  isSelected,
  isToday,
  disabled,
  onPress,
}) => {
  const dayOfWeek = date.getDay();
  const isWeekendDay = isWeekend(dayOfWeek);
  const isTodayAndSelected = isToday && isSelected;
  const isTodayNotSelected = isToday && !isSelected;

  const dateColor = isTodayAndSelected
    ? COLORS.surface
    : isTodayNotSelected
    ? COLORS.primary
    : isSelected
    ? COLORS.surface
    : isWeekendDay
    ? COLORS.subtext
    : COLORS.onSurface;

  const containerStyle = isTodayAndSelected
    ? styles.dateContainerTodaySelected
    : isTodayNotSelected
    ? styles.dateContainerToday
    : isSelected
    ? styles.dateContainerSelected
    : null;

  const handlePress = useCallback(() => {
    if (!disabled) {
      onPress(date);
    }
  }, [date, disabled, onPress]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.dayColumn,
        pressed && !disabled && styles.dayColumnPressed,
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text style={[styles.weekdayText, { color: isSelected ? COLORS.onSurface : COLORS.subtext }]}>
        {WEEKDAYS[dayOfWeek]}
      </Text>
      <View style={[styles.dateContainer, containerStyle]}>
        <Text style={[styles.dateText, { color: dateColor }]}>
          {date.getDate()}
        </Text>
      </View>
    </Pressable>
  );
});

DayColumn.displayName = 'DayColumn';

// ============================================================================
// WEEK ROW COMPONENT
// ============================================================================

interface WeekRowProps {
  weekStart: Date;
  selectedDate: Date | null;
  today: Date;
  disabled: boolean;
  onSelectDate: (date: Date) => void;
  width: number;
}

const WeekRow = memo<WeekRowProps>(({
  weekStart,
  selectedDate,
  today,
  disabled,
  onSelectDate,
  width,
}) => {
  const dates = useMemo(() => getWeekDates(weekStart), [weekStart]);

  return (
    <View style={[styles.weekRow, { width }]}>
      {dates.map((date, index) => (
        <DayColumn
          key={index}
          date={date}
          isSelected={selectedDate ? isSameDay(date, selectedDate) : false}
          isToday={isSameDay(date, today)}
          disabled={disabled}
          onPress={onSelectDate}
        />
      ))}
    </View>
  );
});

WeekRow.displayName = 'WeekRow';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CalendarWeekComponent: React.FC<CalendarWeekProps> = ({
  selectedDate: selectedDateProp,
  today: todayProp,
  onSelectDate,
  onWeekChange,
  disabled = false,
  testID,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const currentIndexRef = useRef(CENTER_INDEX);
  const hasInitialized = useRef(false);
  const needsRecenter = useRef(false);

  // Normalize today to midnight
  const today = useMemo(() => {
    const d = todayProp ? new Date(todayProp) : new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, [todayProp]);

  // Default selected date to today if not provided
  const selectedDate = selectedDateProp !== undefined ? selectedDateProp : today;

  // Anchor week state - the week at the center of our buffer
  const [anchorWeekStart, setAnchorWeekStart] = useState(() => getWeekStart(selectedDate || today));
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);
  const lastSelectedWeekRef = useRef<number>(getWeekStart(selectedDate || today).getTime());

  // Generate all weeks (WEEKS_BUFFER before + current + WEEKS_BUFFER after)
  const weeks = useMemo(() => {
    const result: Date[] = [];
    for (let i = -WEEKS_BUFFER; i <= WEEKS_BUFFER; i++) {
      const weekStart = new Date(anchorWeekStart);
      weekStart.setDate(weekStart.getDate() + i * 7);
      result.push(weekStart);
    }
    return result;
  }, [anchorWeekStart]);

  // Handle container layout to get width
  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width !== containerWidth) {
      setContainerWidth(width);
      // Scroll to center after width is determined
      if (!hasInitialized.current) {
        setTimeout(() => {
          scrollRef.current?.scrollTo({ x: width * CENTER_INDEX, animated: false });
          hasInitialized.current = true;
        }, 100);
      }
    }
  }, [containerWidth]);

  // Track scroll to notify parent of visible week
  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / containerWidth);

    if (index !== currentIndexRef.current && index >= 0 && index < weeks.length) {
      currentIndexRef.current = index;
      onWeekChange?.(weeks[index]);
    }
  }, [containerWidth, weeks, onWeekChange]);

  // Handle recentering after anchor week changes
  useEffect(() => {
    if (needsRecenter.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: containerWidth * CENTER_INDEX, animated: false });
        needsRecenter.current = false;
      }, 0);
    }
  }, [anchorWeekStart, containerWidth]);

  // Navigate to selected date's week when it changes externally
  useEffect(() => {
    if (!selectedDate) return;
    
    const selectedWeekStart = getWeekStart(selectedDate);
    const selectedWeekTime = selectedWeekStart.getTime();
    
    // Only navigate if the week actually changed
    if (selectedWeekTime !== lastSelectedWeekRef.current) {
      lastSelectedWeekRef.current = selectedWeekTime;
      needsRecenter.current = true;
      currentIndexRef.current = CENTER_INDEX;
      setAnchorWeekStart(selectedWeekStart);
    }
  }, [selectedDate]);

  // Handle scroll end - recenter if near edges
  const handleScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / containerWidth);

    // Recenter when user is getting close to edges
    if (index <= 1 || index >= TOTAL_WEEKS - 2) {
      const visibleWeek = weeks[index];
      if (visibleWeek) {
        needsRecenter.current = true;
        currentIndexRef.current = CENTER_INDEX;
        setAnchorWeekStart(visibleWeek);
      }
    }
  }, [containerWidth, weeks]);

  // Handle date selection
  const handleSelectDate = useCallback((date: Date) => {
    onSelectDate?.(date);
  }, [onSelectDate]);

  return (
    <View style={styles.container} testID={testID} onLayout={handleLayout}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEnabled={!disabled}
        contentOffset={{ x: containerWidth * CENTER_INDEX, y: 0 }}
      >
        {weeks.map((weekStart) => (
          <WeekRow
            key={weekStart.getTime()}
            weekStart={weekStart}
            selectedDate={selectedDate}
            today={today}
            disabled={disabled}
            onSelectDate={handleSelectDate}
            width={containerWidth}
          />
        ))}
      </ScrollView>
    </View>
  );
};

CalendarWeekComponent.displayName = 'CalendarWeek';

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  dayColumnPressed: {
    backgroundColor: '#f4f4f4',
  },
  weekdayText: {
    fontFamily: FONT_FAMILIES.nunito.bold,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 4,
  },
  dateContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContainerSelected: {
    backgroundColor: '#333335',
  },
  dateContainerTodaySelected: {
    backgroundColor: COLORS.primary,
  },
  dateContainerToday: {
    backgroundColor: 'rgba(0, 112, 243, 0.25)',
  },
  dateText: {
    fontFamily: FONT_FAMILIES.nunito.semiBold,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semiBold,
    textAlign: 'center',
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export const CalendarWeek = memo(CalendarWeekComponent);
export default CalendarWeek;
