# Font Setup Guide

This project uses **Nunito** from Google Fonts. Follow the setup instructions for your environment.

## Option 1: Expo (Recommended if using Expo)

```bash
npx expo install expo-font @expo-google-fonts/nunito
```

Then in your `App.tsx`:

```typescript
import { useFonts, Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Bold': Nunito_700Bold,
    'Nunito-ExtraBold': Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Your app content
}
```

## Option 2: Bare React Native

### 1. Download Fonts

Download Nunito from [Google Fonts](https://fonts.google.com/specimen/Nunito):
- Nunito-Regular.ttf (400)
- Nunito-Bold.ttf (700)
- Nunito-ExtraBold.ttf (800)

### 2. Add Fonts to Project

Create `assets/fonts/` directory and place the downloaded fonts there:

```
assets/
  fonts/
    Nunito-Regular.ttf
    Nunito-Bold.ttf
    Nunito-ExtraBold.ttf
```

### 3. Link Fonts

```bash
npx react-native-asset
```

Or manually edit `ios/YourApp/Info.plist`:

```xml
<key>UIAppFonts</key>
<array>
  <string>Nunito-Regular.ttf</string>
  <string>Nunito-Bold.ttf</string>
  <string>Nunito-ExtraBold.ttf</string>
</array>
```

And for Android, fonts are automatically linked when placed in `android/app/src/main/assets/fonts/`

## Option 3: React Native Web (Current Preview)

Fonts are loaded via Google Fonts CDN in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
```

Then in CSS:

```css
body {
  font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

## Verification

To verify fonts are loaded correctly, check:

1. **iOS Simulator**: Text should appear in Nunito
2. **Android Emulator**: Text should appear in Nunito
3. **Web**: Open DevTools → Elements → Computed → font-family should show "Nunito"

If fonts don't load, fallback to system font (-apple-system/Roboto) will be used.

## Typography System

Import and use the typography system:

```typescript
import { TYPOGRAPHY } from './src/styles/typography';

const styles = StyleSheet.create({
  heading: TYPOGRAPHY.h1,
  body: TYPOGRAPHY.body,
  button: TYPOGRAPHY.button,
});
```

Available presets:
- `h1`, `h2`, `h3` - Headings
- `body`, `bodyLarge`, `bodySmall` - Body text
- `button` - Button text (Nunito Bold 20px)
- `label` - Form labels
- `caption` - Small text

