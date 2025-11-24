# Manxz Components

🪶 **Lightweight** | 🎯 **Production-Ready** | ⚡ **Zero Dependencies**

Production-grade React Native component library with headless architecture.

## Why Manxz Components?

✅ **Super Lightweight** - ~50KB, zero runtime dependencies  
✅ **Tree Shakeable** - Import only what you need  
✅ **Peer Dependencies Only** - Uses React & RN from your project  
✅ **TypeScript First** - Full type safety  
✅ **Headless Architecture** - Reusable logic hooks  
✅ **Mobile-First** - Optimized for touch interactions  
✅ **Accessible** - WCAG AA compliant  

## 🏗️ Architecture

All components follow a **headless pattern**:
- `Component.tsx` - UI implementation
- `useComponent.ts` - Logic hook (state & handlers)
- Clean separation of concerns for maximum reusability

## 📦 Installation

```bash
npm install manxz-components
# or
yarn add manxz-components
```

**Bundle size impact:** ~12KB minified (just the components you use)

**Dependencies:** Zero! Only requires `react` and `react-native` which you already have.

## 📦 Components

### Button

Versatile button component with multiple variants and states.

**Variants:**
- `outline` - White with border (default)
- `primary` - Blue background
- `positive` - Green background
- `negative` - Red background
- `neutral` - Dark background

**States:**
- Default - Normal interactive state
- Pressed/Active - Visual feedback when user touches button (mobile-first)
- Disabled - Non-interactive state
- Loading - Shows spinner, blocks interaction

> **Note:** The "pressed" state provides tactile feedback when the user's finger touches the button (triggered by `onPressIn`). This is a mobile-first component - there is no hover state.

**Import:**
```typescript
import { Button } from 'manxz-components';
```

**Usage:**
```tsx
<Button
  text="Continue"
  variant="primary"
  icon={<YourIcon />}
  onPress={() => handleAction()}
  loading={isLoading}
  fullWidth
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Button label text |
| `variant` | `'outline' \| 'primary' \| 'positive' \| 'negative' \| 'neutral'` | `'outline'` | Visual style |
| `icon` | `React.ReactNode` | `undefined` | Optional icon (24x24 recommended) |
| `disabled` | `boolean` | `false` | Disables interactions |
| `loading` | `boolean` | `false` | Shows loading indicator |
| `onPress` | `function` | `undefined` | Press handler |
| `fullWidth` | `boolean` | `false` | Stretch to full width |
| `scaleAnimation` | `boolean` | `true` | Enable press scale animation |
| `testID` | `string` | `undefined` | Test identifier |

### Press Feedback

The button provides multiple layers of tactile feedback when pressed:

1. **Color Change** - Background lightens to pressed state color
2. **Scale Animation** - Subtle spring animation (scales to 99%)
3. **State Management** - Visual changes triggered by `onPressIn`/`onPressOut`

```tsx
// Disable scale animation if needed
<Button 
  text="No Animation" 
  scaleAnimation={false}
  onPress={handlePress}
/>
```

## 🎨 Design System

### Typography

Centralized typography system in `src/styles/typography.ts`:

```typescript
import { TYPOGRAPHY } from 'manxz-components';

// Use predefined styles
const styles = StyleSheet.create({
  heading: TYPOGRAPHY.h1,      // Nunito Bold 32px
  body: TYPOGRAPHY.body,        // Nunito Regular 16px
  button: TYPOGRAPHY.button,    // Nunito Bold 20px (from Figma)
});
```

**Font Setup Required:**
See [FONT_SETUP.md](./FONT_SETUP.md) for installation instructions (Expo or bare RN).

**Available Presets:**
- `h1`, `h2`, `h3` - Headings (Bold)
- `body`, `bodyLarge`, `bodySmall` - Body text (Regular)
- `button` - Button text (Bold 20px)
- `label` - Form labels (Bold 14px)
- `caption` - Small text (Regular 12px)

### Colors

Centralized color system in `src/styles/colors.ts`:

```typescript
import { COLORS } from 'manxz-components';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
  },
});
```

**Color Tokens:**
- Primary: `#0070f3` (pressed: `#2385f8`)
- Positive: `#06df79` (pressed: `#38e594`)
- Negative: `#ff2600` (pressed: `#ff5233`)
- Neutral: `#1d1d1f` (pressed: `#333335`)
- Surface: `#fafafa`
- Text: `#1d1d1f`, `#7d7d7f` (secondary)

> Pressed states provide visual feedback during touch interaction (mobile-first design)

### Spacing & Layout

- Button height: 64px
- Border radius: 12px
- Icon size: 24px
- Gap between icon and text: 8px

### Icons

Using **Phosphor Icons**:
- Package: `phosphor-react-native` (RN) / `phosphor-react` (Web)
- Size: 24px
- Weights: regular, bold, light, etc.

## 🔧 Setup

### 1. Install Font

Add Nunito to your project:

```bash
# Using Expo
npx expo install expo-font @expo-google-fonts/nunito

# OR manually add to assets and link
```

### 2. Use Components

```tsx
import { Button } from 'manxz-components';

function App() {
  return (
    <Button 
      text="Get Started" 
      variant="primary" 
      onPress={() => console.log('Pressed')} 
    />
  );
}
```

## 📱 Preview on Your Phone

Want to see components on your actual device?

```bash
cd expo-preview
npm start
```

Then scan the QR code with Expo Go app! See [expo-preview/README.md](./expo-preview/README.md) for details.

## 🧪 Testing

Components include proper accessibility props and testID support:

```tsx
<Button 
  text="Submit" 
  testID="submit-button"
  onPress={handleSubmit}
/>
```

## 📝 Backend Integration Notes

### Button Component

**What your backend engineer needs to know:**

1. **Loading State:**
   - Set `loading={true}` during async operations
   - Button automatically disables during loading

2. **Event Handling:**
   - Use `onPress` callback to trigger API calls
   - Example:
   ```tsx
   <Button 
     text="Save" 
     loading={isSaving}
     onPress={async () => {
       setIsSaving(true);
       await api.save(data);
       setIsSaving(false);
     }}
   />
   ```

3. **Error States:**
   - Use `variant="negative"` for destructive actions
   - Use `disabled` prop when form validation fails

4. **Success States:**
   - Use `variant="positive"` for confirmations
   - Combine with loading for async operations

## 📄 License

Private - Manxz Components
