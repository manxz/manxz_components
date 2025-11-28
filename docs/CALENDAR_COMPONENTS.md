# Calendar Components

This guide covers the three calendar components available in the manxz component library.

---

## Table of Contents

- [Calendar (Month View)](#calendar-month-view)
- [CalendarWeek (Week Strip)](#calendarweek-week-strip)
- [CalendarTimeSlot (Time Slot Button)](#calendartimeslot-time-slot-button)

---

## Calendar (Month View)

A full month calendar grid with navigation arrows to switch months.

### Import

```tsx
// If using as a package
import { Calendar } from 'manxz-components';

// If using locally within expo-preview
import { Calendar } from '../components/Calendar';
```

### Basic Usage

```tsx
const [selectedDate, setSelectedDate] = useState<Date | null>(null);

<Calendar
  onSelectDate={(date) => setSelectedDate(date)}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `today` | `Date` | `new Date()` | Which date shows the blue "today" circle |
| `onSelectDate` | `(date: Date) => void` | - | Called when user taps a date |
| `onMonthChange` | `(date: Date) => void` | - | Called when user navigates to a different month |
| `highlightedDates` | `Date[]` | `[]` | Dates to show with gray background (days with events) |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `testID` | `string` | - | Test identifier |

### Visual States

- **Normal day**: Black text on white background
- **Weekend day**: Gray text (slightly dimmed)
- **Today**: Blue circle with white text
- **Highlighted (has events)**: Gray background
- **Other month days**: Gray text (dates from prev/next month shown for context)

### Example: Calendar with Events

```tsx
const eventsData = [
  new Date(2024, 11, 5),
  new Date(2024, 11, 12),
  new Date(2024, 11, 18),
];

<Calendar
  highlightedDates={eventsData}
  onSelectDate={(date) => {
    console.log('Selected:', date.toLocaleDateString());
    // Fetch events for this date
  }}
  onMonthChange={(monthDate) => {
    console.log('Month changed to:', monthDate.getMonth() + 1);
    // Fetch events for new month
  }}
/>
```

---

## CalendarWeek (Week Strip)

A horizontal week view with swipe navigation. Week always starts on Sunday.

### Import

```tsx
// If using as a package
import { CalendarWeek } from 'manxz-components';

// If using locally within expo-preview
import { CalendarWeek } from '../components/Calendar';
```

### Basic Usage

```tsx
const [selectedDate, setSelectedDate] = useState<Date>(new Date());

<CalendarWeek
  selectedDate={selectedDate}
  onSelectDate={(date) => setSelectedDate(date)}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedDate` | `Date \| null` | Today | Currently selected date (shown with circle) |
| `today` | `Date` | `new Date()` | Override for "today" indicator |
| `onSelectDate` | `(date: Date) => void` | - | Called when user taps a date |
| `onWeekChange` | `(weekStart: Date) => void` | - | Called when user swipes to a new week (provides Sunday of that week) |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `testID` | `string` | - | Test identifier |

### Visual States

- **Selected (not today)**: Black circle with white text
- **Today (not selected)**: Light blue circle with blue text
- **Today AND selected**: Blue circle with white text
- **Weekend**: Gray text
- **Normal**: Black text

### Swipe Behavior

- Swipe left → Next week
- Swipe right → Previous week
- Native scroll physics with paging

### Example: Week View with Events

```tsx
const [selectedDate, setSelectedDate] = useState<Date>(new Date());

<CalendarWeek
  selectedDate={selectedDate}
  onSelectDate={(date) => {
    setSelectedDate(date);
    fetchEventsForDate(date);
  }}
  onWeekChange={(weekStart) => {
    // weekStart is always a Sunday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    console.log(`Showing week: ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`);
    // Optionally prefetch events for this week
  }}
/>
```

---

## CalendarTimeSlot (Time Slot Button)

A selectable time slot button for scheduling. Typically used in a grid or list.

### Import

```tsx
// If using as a package
import { CalendarTimeSlot } from 'manxz-components';

// If using locally within expo-preview
import { CalendarTimeSlot } from '../components/Calendar';
```

### Basic Usage

```tsx
<CalendarTimeSlot
  label="10AM-12PM"
  state="available"
  onPress={() => console.log('Selected!')}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **required** | Time range text (e.g., "10AM-12PM") |
| `state` | `'available' \| 'selected' \| 'disabled'` | `'available'` | Visual state |
| `onPress` | `() => void` | - | Called when slot is tapped (only works when `available`) |
| `style` | `ViewStyle` | - | Custom container styles |
| `testID` | `string` | - | Test identifier |

### Visual States

| State | Background | Text | Border | Other |
|-------|------------|------|--------|-------|
| `available` | White | Black | Gray | Shadow, press feedback |
| `selected` | Blue | White | None | Shadow |
| `disabled` | Light gray | Gray | Light gray | 70% opacity |

### Example: Radio-Style Selection

Time slots behave like radio buttons—only one can be selected at a time:

```tsx
const timeSlots = [
  { id: '1', label: '9AM-10AM' },
  { id: '2', label: '10AM-11AM' },
  { id: '3', label: '11AM-12PM' },
  { id: '4', label: '12PM-1PM' },
];

const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
const bookedSlots = ['3']; // Already booked

<View style={{ gap: 12 }}>
  {timeSlots.map((slot) => {
    const isBooked = bookedSlots.includes(slot.id);
    const isSelected = selectedSlot === slot.id;
    
    return (
      <CalendarTimeSlot
        key={slot.id}
        label={slot.label}
        state={isBooked ? 'disabled' : isSelected ? 'selected' : 'available'}
        onPress={() => setSelectedSlot(slot.id)}
      />
    );
  })}
</View>
```

---

## Full Example: Booking Flow

Here's how to combine all three components in a booking interface:

```tsx
import { Calendar, CalendarWeek, CalendarTimeSlot } from 'manxz-components';

function BookingScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Fetch available slots when date changes
  useEffect(() => {
    async function loadSlots() {
      const slots = await api.getAvailableSlots(selectedDate);
      setAvailableSlots(slots);
      setSelectedSlot(null); // Reset selection
    }
    loadSlots();
  }, [selectedDate]);

  return (
    <View style={{ flex: 1 }}>
      {/* Week strip at top */}
      <CalendarWeek
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Time slots */}
      <ScrollView style={{ padding: 16 }}>
        <Text style={styles.heading}>Available Times</Text>
        
        <View style={{ gap: 12 }}>
          {availableSlots.map((slot) => (
            <CalendarTimeSlot
              key={slot.id}
              label={slot.label}
              state={
                slot.isBooked ? 'disabled' :
                selectedSlot === slot.id ? 'selected' : 'available'
              }
              onPress={() => setSelectedSlot(slot.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Confirm button */}
      {selectedSlot && (
        <Button onPress={() => confirmBooking(selectedDate, selectedSlot)}>
          Confirm Booking
        </Button>
      )}
    </View>
  );
}
```

---

## API Integration Notes

### Date Handling

All components use JavaScript `Date` objects. When sending to your backend:

```tsx
// Convert to ISO string for API
const dateString = selectedDate.toISOString();
// "2024-12-15T00:00:00.000Z"

// Or just the date part
const dateOnly = selectedDate.toISOString().split('T')[0];
// "2024-12-15"
```

### Week Start

`CalendarWeek.onWeekChange` provides the **Sunday** of that week:

```tsx
onWeekChange={(weekStart) => {
  // weekStart is always Sunday
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6); // Saturday
  
  // Fetch events for the week
  api.getWeekEvents({
    startDate: weekStart.toISOString(),
    endDate: weekEnd.toISOString(),
  });
}}
```

### Highlighted Dates (Events)

To show days with events on the Calendar:

```tsx
// Fetch from API
const response = await api.getEventsForMonth(year, month);
// response.data = [{ date: "2024-12-05" }, { date: "2024-12-12" }, ...]

// Convert to Date objects
const highlightedDates = response.data.map(
  (event) => new Date(event.date)
);

<Calendar highlightedDates={highlightedDates} />
```

---

## Questions?

Ping Oscar if something's unclear!

