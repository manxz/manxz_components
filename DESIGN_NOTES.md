# Design System Notes

## Mobile-First Approach

This component library is built with a **mobile-first philosophy**. All interactions are optimized for touch/tap rather than mouse hover.

## Button States

### Terminology Clarification

**Figma labels:** Some variants are labeled as "Hover" in Figma  
**Actual implementation:** These are implemented as **"Pressed" or "Active"** states

### Why the difference?

- **Mobile devices don't have hover states**
- The visual feedback happens when the user **touches** the button
- This is triggered by `onPressIn` event (finger down)
- Released with `onPressOut` event (finger up)

### State Flow

```
User not touching → Default state
       ↓
User touches button (onPressIn) → Pressed/Active state (color changes)
       ↓
User lifts finger (onPressOut) → Returns to Default
       ↓
onPress fires → Action executed
```

### Design Tokens

All "hover" references in Figma correspond to "pressed" states in code:

| Figma Label | Code Implementation | Trigger |
|-------------|---------------------|---------|
| `State=Default` | `default` | Normal state |
| `State=Hover` | `pressed/active` | `onPressIn` |
| `State=Disabled` | `disabled` | `disabled={true}` |

### Color Naming Convention

```typescript
// ✅ Correct (mobile-first)
primaryPressed: '#2385f8'
positivePressed: '#38e594'

// ❌ Avoid (web-centric)
primaryHover: '#2385f8'
positiveHover: '#38e594'
```

## Touch Target Guidelines

- Minimum button height: **64px** (exceeds 44px iOS / 48px Android minimum)
- Full-width buttons provide larger touch targets
- Icons are 24x24 with adequate spacing
- Border radius: 12px for comfortable tap areas
- Subtle scale animation: 99% (barely noticeable but provides feedback)

## Accessibility

- `accessibilityRole="button"` for screen readers
- `accessibilityState` reflects disabled/loading states
- `accessibilityLabel` provides context
- Adequate color contrast ratios (WCAG AA compliant)
- Haptic feedback can be added via `Haptics` module

## Performance

- `React.memo()` prevents unnecessary re-renders
- `useCallback` for event handlers
- `StyleSheet.create` for optimized styles
- Minimal dependencies (just React Native core)

## Future Considerations

- Haptic feedback on press (via `expo-haptics` or `react-native-haptic-feedback`)
- Ripple effect for Android (Material Design)
- Scale animation on press (subtle transform)
- Custom press timing/duration

