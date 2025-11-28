/**
 * Calendar Component
 * 
 * Description:
 * A month calendar component with today indicator and date selection.
 * Shows a full month grid with weekday headers. Blue circle indicates today.
 * 
 * Props:
 * - today: Date — Date to show as "today" with blue circle (defaults to current date)
 * - onSelectDate: (date: Date) => void — Callback when date is tapped
 * - onMonthChange: (date: Date) => void — Callback when month changes
 * - highlightedDates: Date[] — Dates to highlight with gray background
 * - minDate: Date — Minimum selectable date
 * - maxDate: Date — Maximum selectable date
 * - disabled: boolean — Disables all interactions
 * - testID: string — Test identifier
 * 
 * Usage example:
 * <Calendar 
 *   onSelectDate={(date) => handleDateTap(date)}
 *   highlightedDates={availableDates}
 * />
 */

import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { COLORS } from '../../styles/colors';
import { FONT_FAMILIES, FONT_WEIGHTS, FONT_SIZES } from '../../styles/typography';

// ============================================================================
// TYPES
// ============================================================================

export interface CalendarProps {
  /** Reference date for "today" indicator (defaults to current date) */
  today?: Date;
  /** Callback when date is selected */
  onSelectDate?: (date: Date) => void;
  /** Callback when month changes */
  onMonthChange?: (date: Date) => void;
  /** Dates to highlight with gray background */
  highlightedDates?: Date[];
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Disables all interactions */
  disabled?: boolean;
  /** Test identifier */
  testID?: string;
}

// ============================================================================
// DESIGN TOKENS
// ============================================================================

const SPACING = {
  borderRadius: 12,
  cellHeight: 64,
  headerPaddingVertical: 8,
  monthSelectorPadding: 16,
  todayCircleSize: 32,
  todayCircleRadius: 16,
} as const;

// ============================================================================
// HELPERS
// ============================================================================

const WEEKDAYS = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const isDateInArray = (date: Date, dates: Date[]): boolean => {
  return dates.some(d => isSameDay(d, date));
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

// ============================================================================
// DATE CELL COMPONENT
// ============================================================================

interface DateCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHighlighted: boolean;
  isWeekendDay: boolean;
  isFirst: boolean;
  isLast: boolean;
  disabled: boolean;
  onPress: (date: Date) => void;
}

const DateCell: React.FC<DateCellProps> = memo(({
  date,
  isCurrentMonth,
  isToday,
  isHighlighted,
  isWeekendDay,
  isFirst,
  isLast,
  disabled,
  onPress,
}) => {
  const handlePress = useCallback(() => {
    if (!disabled && isCurrentMonth) {
      onPress(date);
    }
  }, [date, disabled, isCurrentMonth, onPress]);

  const getTextColor = () => {
    if (isToday) return COLORS.white;
    if (!isCurrentMonth) return COLORS.subtext;
    if (isWeekendDay) return COLORS.subtext;
    return COLORS.onSurface;
  };

  const getTextOpacity = () => {
    if (isWeekendDay && !isToday) return 0.7;
    if (!isCurrentMonth) return 1;
    return 1;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.dateCell,
        !isLast && styles.dateCellBorder,
        isHighlighted && !isToday && styles.dateCellHighlighted,
        pressed && !disabled && isCurrentMonth && styles.dateCellPressed,
      ]}
      onPress={handlePress}
      disabled={disabled || !isCurrentMonth}
    >
      {isToday ? (
        <View style={styles.todayContainer}>
          <Text style={styles.todayText}>{date.getDate()}</Text>
        </View>
      ) : (
        <Text style={[
          styles.dateText,
          { color: getTextColor(), opacity: getTextOpacity() }
        ]}>
          {date.getDate()}
        </Text>
      )}
    </Pressable>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CalendarComponent: React.FC<CalendarProps> = ({
  today: todayProp,
  onSelectDate,
  onMonthChange,
  highlightedDates = [],
  minDate,
  maxDate,
  disabled = false,
  testID,
}) => {
  // Today's date (defaults to current date)
  const today = todayProp || new Date();
  
  // Current displayed month (defaults to today)
  const [displayDate, setDisplayDate] = useState(() => {
    return today;
  });

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  // Navigate months
  const goToPreviousMonth = useCallback(() => {
    const newDate = new Date(year, month - 1, 1);
    setDisplayDate(newDate);
    onMonthChange?.(newDate);
  }, [year, month, onMonthChange]);

  const goToNextMonth = useCallback(() => {
    const newDate = new Date(year, month + 1, 1);
    setDisplayDate(newDate);
    onMonthChange?.(newDate);
  }, [year, month, onMonthChange]);

  // Handle date selection
  const handleSelectDate = useCallback((date: Date) => {
    onSelectDate?.(date);
  }, [onSelectDate]);

  // Generate calendar grid
  const calendarGrid = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const grid: Date[][] = [];
    let currentRow: Date[] = [];

    // Add days from previous month
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      currentRow.push(new Date(year, month - 1, day));
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      if (currentRow.length === 7) {
        grid.push(currentRow);
        currentRow = [];
      }
      currentRow.push(new Date(year, month, day));
    }

    // Add days from next month
    let nextMonthDay = 1;
    while (currentRow.length < 7) {
      currentRow.push(new Date(year, month + 1, nextMonthDay));
      nextMonthDay++;
    }
    grid.push(currentRow);

    return grid;
  }, [year, month]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={styles.container} testID={testID}>
      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <Pressable 
          onPress={goToPreviousMonth} 
          disabled={disabled}
          hitSlop={8}
        >
          <CaretLeft 
            size={24} 
            color={disabled ? COLORS.disabledText : COLORS.onSurface} 
            weight="regular" 
          />
        </Pressable>
        
        <Text style={[styles.monthText, disabled && styles.disabledText]}>
          {MONTH_NAMES[month]}
        </Text>
        
        <Pressable 
          onPress={goToNextMonth} 
          disabled={disabled}
          hitSlop={8}
        >
          <CaretRight 
            size={24} 
            color={disabled ? COLORS.disabledText : COLORS.onSurface} 
            weight="regular" 
          />
        </Pressable>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {/* Weekday Header */}
        <View style={styles.weekdayRow}>
          {WEEKDAYS.map((day, index) => (
            <View 
              key={day + index} 
              style={[
                styles.weekdayCell,
                index < 6 && styles.weekdayCellBorder,
              ]}
            >
              <Text style={styles.weekdayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Date Rows */}
        {calendarGrid.map((row, rowIndex) => (
          <View 
            key={rowIndex} 
            style={[
              styles.dateRow,
              rowIndex < calendarGrid.length - 1 && styles.dateRowBorder,
            ]}
          >
            {row.map((date, cellIndex) => (
              <DateCell
                key={date.toISOString()}
                date={date}
                isCurrentMonth={date.getMonth() === month}
                isToday={isSameDay(date, today)}
                isHighlighted={isDateInArray(date, highlightedDates)}
                isWeekendDay={isWeekend(date)}
                isFirst={cellIndex === 0}
                isLast={cellIndex === 6}
                disabled={disabled}
                onPress={handleSelectDate}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.monthSelectorPadding,
  },
  monthText: {
    fontFamily: FONT_FAMILIES.nunito.bold,
    fontSize: 24,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.onSurface,
  },
  disabledText: {
    color: COLORS.disabledText,
  },
  calendarGrid: {
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: SPACING.borderRadius,
    overflow: 'hidden',
  },
  weekdayRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.headerPaddingVertical,
  },
  weekdayCellBorder: {
    borderRightWidth: 1,
    borderRightColor: COLORS.outline,
  },
  weekdayText: {
    fontFamily: FONT_FAMILIES.nunito.bold,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.subtext,
  },
  dateRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
  },
  dateRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
  },
  dateCell: {
    flex: 1,
    height: SPACING.cellHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCellBorder: {
    borderRightWidth: 1,
    borderRightColor: COLORS.outline,
  },
  dateCellHighlighted: {
    backgroundColor: '#eaeaea',
  },
  dateCellPressed: {
    backgroundColor: '#f4f4f4', // Same as COLORS.whitePressed / outline button press
  },
  dateText: {
    fontFamily: FONT_FAMILIES.nunito.semiBold,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  todayContainer: {
    width: SPACING.todayCircleSize,
    height: SPACING.todayCircleSize,
    borderRadius: SPACING.todayCircleRadius,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayText: {
    fontFamily: FONT_FAMILIES.nunito.semiBold,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.white,
    textAlign: 'center',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export const Calendar = memo(CalendarComponent);
export default Calendar;

