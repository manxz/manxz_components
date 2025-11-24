# 📱 Expo Preview App

Preview Manxz Components on your phone with Expo Go!

## Quick Start

1. **Install Expo Go on your phone:**
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Start the preview server:**
   ```bash
   cd expo-preview
   npm start
   ```

3. **Scan the QR code:**
   - iOS: Open Camera app and scan the QR code
   - Android: Open Expo Go app and tap "Scan QR code"

4. **See your components live on your phone!** 🎉

## Features

✅ Real device testing  
✅ Hot reload (changes appear instantly)  
✅ Native animations & gestures  
✅ Real touch feedback  
✅ Proper font rendering  

## Development Workflow

1. Make changes to components in `../src/components/`
2. Save the file
3. Watch it update on your phone instantly!

## Troubleshooting

### Fonts not loading?
- Wait a few seconds for fonts to download
- Restart the Expo app

### QR code not working?
- Make sure your phone and computer are on the same WiFi network
- Try using the tunnel connection: `npm start -- --tunnel`

### App crashes on startup?
- Check that all dependencies are installed: `npm install`
- Clear Expo cache: `npm start -- --clear`

## What This Preview Includes

- ✅ All Button variants
- ✅ All Button states
- ✅ Press feedback testing
- ✅ Loading states
- ✅ Phosphor icons
- ✅ Proper typography (Nunito)

## Performance Testing

This preview app is perfect for testing:
- Touch responsiveness
- Animation smoothness
- Press feedback feel
- Color accuracy
- Font rendering
- Shadow rendering
- Real device performance

