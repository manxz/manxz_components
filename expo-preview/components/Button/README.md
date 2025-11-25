# Button Component

## Overview

Production-ready button component with comprehensive press feedback and state management.

## Features

✅ **5 Visual Variants** - Primary, Positive, Negative, Neutral, Outline  
✅ **Press Feedback** - Color change + scale animation  
✅ **Loading State** - Built-in spinner  
✅ **Disabled State** - Automatic interaction blocking  
✅ **Icon Support** - Phosphor icons (24x24)  
✅ **Accessibility** - Full a11y support  
✅ **TypeScript** - Full type safety  
✅ **Headless Logic** - Reusable `useButton` hook  

## Press Feedback Mechanism

When a user presses the button, multiple feedback layers activate:

### 1. Color Change (Pressed State)
```typescript
Primary:   #0070f3 → #2385f8  (lighter blue)
Positive:  #06df79 → #38e594  (lighter green)
Negative:  #ff2600 → #ff5233  (lighter red)
Neutral:   #1d1d1f → #333335  (lighter gray)
Outline:   #ffffff → #f4f4f4  (light gray)
```

### 2. Scale Animation
- Scales down to **99%** on press (very subtle)
- Spring animation with subtle bounce on release
- Native driver for 60fps performance

### 3. Event Flow
```
User touches button
    ↓
onPressIn fires
    ↓
isPressed = true
    ↓
Color changes + Scale animates to 0.96
    ↓
User releases finger
    ↓
onPressOut fires
    ↓
isPressed = false
    ↓
Color reverts + Scale animates back to 1.0
    ↓
onPress fires
    ↓
Your callback executes
```

## Usage Examples

### Basic Button
```tsx
import { Button } from './src/components/Button';

<Button 
  text="Click Me" 
  variant="primary"
  onPress={() => console.log('Pressed!')}
/>
```

### With Icon (Phosphor)
```tsx
import { Check } from 'phosphor-react-native';

<Button 
  text="Confirm"
  variant="positive"
  icon={<Check size={24} color="#fafafa" weight="bold" />}
  onPress={handleConfirm}
  fullWidth
/>
```

### Loading State
```tsx
const [saving, setSaving] = useState(false);

<Button 
  text="Save"
  variant="primary"
  loading={saving}
  onPress={async () => {
    setSaving(true);
    await api.save(data);
    setSaving(false);
  }}
/>
```

### Disabled State
```tsx
<Button 
  text="Submit"
  variant="primary"
  disabled={!isFormValid}
  onPress={handleSubmit}
/>
```

### Without Scale Animation
```tsx
<Button 
  text="No Animation"
  variant="primary"
  scaleAnimation={false}
  onPress={handlePress}
/>
```

## Headless Hook

Use the `useButton` hook for custom button implementations:

```tsx
import { useButton } from './src/components/Button';

function CustomButton({ onPress }) {
  const { 
    isPressed, 
    handlePressIn, 
    handlePressOut, 
    handlePress,
    scaleValue 
  } = useButton({ onPress });

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <Text style={{ color: isPressed ? 'blue' : 'black' }}>
          Custom Button
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
```

## Accessibility

The button includes proper accessibility props:

- `accessibilityRole="button"`
- `accessibilityState` reflects disabled/loading
- `accessibilityLabel` provides context
- Minimum touch target: 64px height

## Performance

- ✅ `React.memo()` prevents unnecessary re-renders
- ✅ `useCallback` for stable event handlers
- ✅ `useNativeDriver: true` for 60fps animations
- ✅ `StyleSheet.create` for optimized styles

## Design System Integration

The button uses centralized design tokens:

```tsx
import { COLORS } from './src/styles/colors';
import { TYPOGRAPHY } from './src/styles/typography';

// Button automatically uses:
TYPOGRAPHY.button  // Nunito Bold 20px
COLORS.primary     // #0070f3
COLORS.primaryPressed  // #2385f8
```

## Testing

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

test('button press feedback', () => {
  const handlePress = jest.fn();
  const { getByTestId } = render(
    <Button 
      text="Test" 
      testID="test-button"
      onPress={handlePress}
    />
  );

  const button = getByTestId('test-button');
  fireEvent.press(button);
  
  expect(handlePress).toHaveBeenCalledTimes(1);
});
```

## Customization

### Disable Press Feedback
```tsx
<Button 
  text="Static Button"
  scaleAnimation={false}
  variant="primary"
  onPress={handlePress}
/>
```

### Custom Styles
Since the button uses StyleSheet.create internally, to customize colors, modify `src/styles/colors.ts`:

```typescript
// src/styles/colors.ts
export const COLORS = {
  primary: '#YOUR_COLOR',
  primaryPressed: '#YOUR_PRESSED_COLOR',
  // ...
};
```

## Mobile Best Practices

✅ Touch target > 44px (button is 64px)  
✅ Clear visual feedback on press  
✅ Loading states prevent double-taps  
✅ Disabled states are visually distinct  
✅ Icons provide visual hierarchy  
✅ Color contrast meets WCAG AA standards  

