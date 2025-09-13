# Tassie Reader - Photo-to-Speech Integration

## Overview

The Tassie Reader feature allows users to take photos of text passages from books and have Tassie (the AI tarsier assistant) read them aloud using a fixed, cute voice. This feature seamlessly integrates OCR (Optical Character Recognition) with Text-to-Speech (TTS) functionality.

## Features

### 🔍 OCR Integration
- **API Service**: Uses existing APILayer OCR service for reliable text extraction
- **Error Handling**: Graceful fallbacks with user-friendly messages
- **Image Sources**: Camera capture or photo library selection
- **React Native Compatible**: No Web Workers or browser dependencies

### 🎵 Text-to-Speech (TTS)
- **Fixed Voice**: Automatically selects the cutest available voice for Tassie
- **Voice Characteristics**: Higher pitch (1.2), slower rate (0.9) for clarity
- **Text Chunking**: Handles long passages by splitting into manageable chunks
- **Playback Controls**: Play, pause, resume, and stop functionality
- **Progress Tracking**: Visual progress bar and percentage completion

### 🎨 UI/UX Features
- **Tassie Branding**: Mascot avatar and personality elements
- **Animations**: Pulsing avatar and sound wave animations during playback
- **Responsive Design**: Works on mobile and desktop
- **Dark Mode Support**: Consistent with app's design system
- **Accessibility**: Screen reader compatible controls

## Component Architecture

### Core Components

#### `useTextToSpeech` Hook
```javascript
// Location: /hooks/useTextToSpeech.js
// Manages speech synthesis with cute voice selection and chunking
const { speak, pause, resume, stop, isPlaying, progress } = useTextToSpeech();
```

#### `OcrCapture` Component
```javascript
// Location: /components/ui/OcrCapture.jsx
// Handles photo capture and text extraction
<OcrCapture onTextExtracted={handleText} onError={handleError} />
```

#### `TTSControls` Component
```javascript
// Location: /components/ui/TTSControls.jsx
// Playback controls with progress indication
<TTSControls isPlaying={isPlaying} onTogglePlayPause={toggle} />
```

#### `ReadingIndicator` Component
```javascript
// Location: /components/ui/ReadingIndicator.jsx
// Animated indicator showing Tassie is speaking
<ReadingIndicator isReading={isPlaying} voiceInfo={voiceInfo} />
```

#### `TassieReader` Component
```javascript
// Location: /components/ui/TassieReader.jsx
// Main integration component combining OCR + TTS
<TassieReader onClose={handleClose} />
```

## Integration with ReadingScreen

The feature is integrated into the existing ReadingScreen via a camera button in the header:

```javascript
// Camera button in header
<TouchableOpacity onPress={() => setShowTassieReader(true)}>
  <Ionicons name="camera" size={20} color="#FE9F1F" />
</TouchableOpacity>

// Modal presentation
<Modal visible={showTassieReader} animationType="slide">
  <TassieReader onClose={() => setShowTassieReader(false)} />
</Modal>
```

## Dependencies

### New Dependencies Added
```json
{
  "expo-camera": "~16.1.7",
  "expo-speech": "~13.1.7"
}
```

### Required Permissions
- Camera access for photo capture
- Media library access for photo selection

## Voice Selection Algorithm

The TTS system automatically selects the cutest available voice using this priority order:

1. **Named Cute Voices**: Samantha, Victoria, Princess, Kathy, Vicki
2. **Google Voices**: UK/US English Female voices
3. **Microsoft Voices**: Zira, Hazel Desktop voices
4. **Generic Female**: Any voice marked as female
5. **Fallback**: First available voice

## Error Handling

### OCR Errors
- **Primary Failure**: Falls back to API-based OCR service
- **Complete Failure**: User-friendly message with retry option
- **No Text Found**: "Couldn't read that clearly" message
- **Poor Image Quality**: Suggestions for better lighting

### TTS Errors
- **Browser Support**: Detects and warns about unsupported browsers
- **Voice Loading**: Handles asynchronous voice loading
- **Synthesis Errors**: Graceful error messages with retry options

## User Flow

1. **Access**: User taps camera icon in ReadingScreen header
2. **Capture**: Choose between camera or photo library
3. **Processing**: Visual feedback during OCR processing
4. **Review**: Extracted text displayed with edit option
5. **Playback**: Automatic reading with manual controls
6. **Interaction**: Play, pause, stop, and retry options

## Performance Considerations

### OCR Optimization
- Image quality optimization before processing
- Chunked processing for large images
- Fallback mechanisms for reliability

### TTS Optimization
- Text chunking to prevent synthesis cutoffs
- Voice caching for consistent experience
- Progress tracking for long passages

## Browser Compatibility

### Supported Browsers
- ✅ Chrome (desktop/mobile)
- ✅ Safari (desktop/mobile)
- ✅ Edge (desktop/mobile)
- ✅ Firefox (limited voice options)

### Features by Platform
- **iOS**: Native voice integration
- **Android**: Google TTS voices
- **Desktop**: System voice selection

## Accessibility Features

- Screen reader compatible controls
- High contrast visual indicators
- Keyboard navigation support
- Voice feedback for actions
- Clear error messaging

## Customization Options

### Voice Characteristics
```javascript
utterance.rate = 0.9;     // Slightly slower for clarity
utterance.pitch = 1.2;    // Higher pitch for cuteness
utterance.volume = 0.8;   // Comfortable volume level
```

### Text Processing
```javascript
const splitTextIntoChunks = (text, maxLength = 200) => {
  // Splits by sentences, respects maxLength
  // Prevents synthesis cutoffs
};
```

## Testing Guidelines

### OCR Testing
- Test various lighting conditions
- Try different text sizes and fonts
- Test with handwritten vs printed text
- Verify fallback mechanisms

### TTS Testing
- Test across different browsers
- Verify voice consistency
- Test long passages (chunking)
- Validate error handling

### UI/UX Testing
- Test modal presentation/dismissal
- Verify animations and feedback
- Test accessibility features
- Validate responsive design

## Future Enhancements

### Potential Improvements
- Language detection and multi-language support
- Voice speed adjustment controls
- Text highlighting during reading
- Bookmark and save extracted text
- Integration with reading progress tracking

### Performance Optimizations
- Image preprocessing for better OCR
- Voice preloading for faster startup
- Caching of frequently used voices
- Offline voice synthesis options

## Troubleshooting

### Common Issues
1. **No voice available**: Check browser compatibility
2. **OCR fails**: Verify image quality and lighting
3. **Synthesis stops**: Text chunking handles long passages
4. **Permissions denied**: Guide user through permission settings

### Debug Information
- Voice selection details available via `voiceInfo`
- OCR processing steps logged to console
- TTS errors captured and displayed to user
- Performance metrics available for optimization
