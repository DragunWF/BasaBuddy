# Text-to-Speech (TTS) Integration Documentation

## Overview

The BasaBuddy app now includes a comprehensive text-to-speech feature that allows users to have any text content read aloud. This feature is designed to enhance the reading experience and provide accessibility support.

## Architecture

### Core Components

1. **TextToSpeechService** (`services/textToSpeechService.js`)
   - Cross-platform TTS service supporting both web (Web Speech API) and native (Expo Speech)
   - Handles voice management, settings, and speech synthesis
   - Provides text chunking for long content

2. **useTextToSpeech Hook** (`hooks/useTextToSpeech.js`)
   - React hook that manages TTS state and functionality
   - Provides easy-to-use interface for components
   - Handles progress tracking and error management

3. **TTSControls Component** (`components/ui/TTSControls.jsx`)
   - Reusable UI component for TTS controls
   - Supports both compact and full display modes
   - Includes voice settings modal with pitch, rate, and volume controls

4. **ReadingIndicator Component** (`components/ui/ReadingIndicator.jsx`)
   - Visual indicator showing when text is being read
   - Animated progress display
   - Positioned as overlay on reading content

## Features

### Core Functionality
- ✅ Play, pause, resume, and stop controls
- ✅ Adjustable voice settings (pitch, rate, volume)
- ✅ Voice selection from available system voices
- ✅ Long text chunking for better performance
- ✅ Cross-platform support (Web and React Native)

### UI/UX Features
- ✅ Consistent design with app's color scheme (#FE9F1F primary)
- ✅ Compact and full control modes
- ✅ Visual reading progress indicator
- ✅ Responsive layout for mobile and desktop
- ✅ Accessibility support
- ✅ Error handling with user-friendly messages

### Integration Points
- ✅ Reading Screen - TTS controls in header toolbar
- ✅ Chat Screen - TTS controls for bot responses
- ✅ Visual indicators during active reading

## Usage Examples

### Basic Usage in a Component

```jsx
import React from 'react';
import { View, Text } from 'react-native';
import TTSControls from '../components/ui/TTSControls';

const MyReadingComponent = () => {
  const textContent = "This is the text that will be read aloud.";
  
  return (
    <View>
      <Text>{textContent}</Text>
      <TTSControls 
        text={textContent}
        compact={false}
        showSettings={true}
      />
    </View>
  );
};
```

### Using the Hook Directly

```jsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const CustomTTSComponent = () => {
  const {
    isPlaying,
    isPaused,
    speak,
    stop,
    updateRate,
    settings
  } = useTextToSpeech();

  const handleSpeak = () => {
    speak("Hello, this is a test message!");
  };

  return (
    <View>
      <TouchableOpacity onPress={handleSpeak}>
        <Text>Speak</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={stop}>
        <Text>Stop</Text>
      </TouchableOpacity>
      <Text>Rate: {settings.rate}</Text>
    </View>
  );
};
```

## Component Props

### TTSControls

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | required | Text content to be read aloud |
| `compact` | boolean | false | Whether to show compact controls |
| `showSettings` | boolean | true | Whether to show settings button |
| `showProgress` | boolean | true | Whether to show progress bar |
| `style` | object | {} | Additional styles for the component |

### ReadingIndicator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | boolean | required | Whether the indicator should be visible |
| `progress` | number | 0 | Reading progress (0-100) |
| `style` | object | {} | Additional styles for the component |

## Hook API

### useTextToSpeech Returns

```javascript
{
  // State
  isPlaying: boolean,
  isPaused: boolean,
  isLoading: boolean,
  currentText: string,
  availableVoices: array,
  settings: object,
  error: string,
  progress: number,
  isSupported: boolean,
  
  // Actions
  speak: (text) => Promise,
  pause: () => boolean,
  resume: () => boolean,
  stop: () => boolean,
  togglePlayPause: () => void,
  
  // Settings
  updateSettings: (settings) => void,
  updateVoice: (voice) => void,
  updateRate: (rate) => void,
  updatePitch: (pitch) => void,
  updateVolume: (volume) => void,
  
  // Utilities
  clearError: () => void
}
```

## Platform Differences

### Web (React Native Web)
- Uses Web Speech Synthesis API
- Full pause/resume support
- Extensive voice selection
- Real-time progress tracking

### Native (iOS/Android)
- Uses Expo Speech API
- Stop-only (no pause/resume due to API limitations)
- System voice selection
- Basic progress simulation

## Styling and Theming

The TTS components follow the app's design system:

- Primary color: `#FE9F1F` (orange)
- Secondary colors: Various grays from `mainColors`
- Consistent border radius: 12px for containers, full for buttons
- Shadow effects for elevated components
- Responsive sizing and spacing

## Error Handling

The TTS system includes comprehensive error handling:

- Platform compatibility checks
- API availability validation
- Network error handling
- User-friendly error messages
- Graceful degradation when TTS is unavailable

## Performance Considerations

- Text chunking for long content (default: 200 characters)
- Lazy loading of voice lists
- Efficient state management
- Memory cleanup on component unmount
- Optimized re-renders with React.memo and useCallback

## Testing

### Manual Testing Checklist

- [ ] Play button starts speech
- [ ] Pause button pauses speech (web only)
- [ ] Stop button stops speech and resets
- [ ] Settings modal opens and closes
- [ ] Voice selection works
- [ ] Rate/pitch/volume sliders work
- [ ] Progress indicator shows during playback
- [ ] Error messages display appropriately
- [ ] Works on both mobile and desktop
- [ ] Integrates properly in Reading and Chat screens

### Browser Compatibility

- ✅ Chrome 71+
- ✅ Firefox 62+
- ✅ Safari 14.1+
- ✅ Edge 79+

### Mobile Compatibility

- ✅ iOS 13+
- ✅ Android 8.0+

## Future Enhancements

- [ ] Highlight text as it's being read
- [ ] Bookmark/resume functionality
- [ ] Speed reading modes
- [ ] Custom voice training
- [ ] Offline voice support
- [ ] Reading statistics and analytics

## Troubleshooting

### Common Issues

1. **TTS not working on mobile**
   - Ensure `expo-speech` is properly installed
   - Check device volume settings
   - Verify app permissions

2. **No voices available**
   - Wait for voices to load (async on some browsers)
   - Check browser/OS language settings
   - Try refreshing the page/app

3. **Choppy playback**
   - Reduce text chunk size
   - Check device performance
   - Close other audio applications

4. **Settings not persisting**
   - Settings are session-based currently
   - Consider implementing AsyncStorage for persistence

## Dependencies

```json
{
  "expo-speech": "~12.1.0",
  "@react-native-community/slider": "^4.5.7"
}
```

## File Structure

```
├── services/
│   └── textToSpeechService.js
├── hooks/
│   └── useTextToSpeech.js
├── components/
│   └── ui/
│       ├── TTSControls.jsx
│       └── ReadingIndicator.jsx
└── docs/
    └── TTS_INTEGRATION_DOCS.md
```
