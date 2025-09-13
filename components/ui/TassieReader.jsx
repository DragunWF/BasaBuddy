import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OcrCapture from './OcrCapture';
import TTSControls from './TTSControls';
import ReadingIndicator from './ReadingIndicator';
import useTextToSpeech from '../../hooks/useTextToSpeech';

const TassieReader = ({ onClose }) => {
  const [extractedText, setExtractedText] = useState('');
  const [showText, setShowText] = useState(false);
  const [error, setError] = useState(null);

  const {
    speak,
    stop,
    togglePlayPause,
    isPlaying,
    isPaused,
    progress,
    error: ttsError,
    isLoading,
    voiceInfo,
    isSupported
  } = useTextToSpeech();

  const handleTextExtracted = (text) => {
    setExtractedText(text);
    setShowText(true);
    setError(null);
    
    // Automatically start reading after a short delay
    setTimeout(() => {
      speak(text);
    }, 500);
  };

  const handleOcrError = (errorMessage) => {
    setError(errorMessage);
    Alert.alert('Oops!', errorMessage, [{ text: 'Try Again', onPress: () => setError(null) }]);
  };

  const handleTryAgain = () => {
    setExtractedText('');
    setShowText(false);
    setError(null);
    stop();
  };

  const handleEditText = () => {
    Alert.prompt(
      'Edit Text',
      'You can edit the extracted text before Tassie reads it:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update', 
          onPress: (newText) => {
            if (newText && newText.trim()) {
              setExtractedText(newText.trim());
              stop(); // Stop current reading
            }
          }
        }
      ],
      'plain-text',
      extractedText
    );
  };

  if (!isSupported) {
    return (
      <View className="bg-white rounded-lg p-6 m-4 shadow-sm border border-gray-200">
        <View className="items-center">
          <Ionicons name="warning" size={48} color="#FE9F1F" />
          <Text className="text-lg font-bold text-gray-800 mt-4 text-center">
            Speech Not Supported
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            Your browser doesn't support text-to-speech. Please try using Chrome, Safari, or Edge.
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="mt-4 bg-[#FE9F1F] py-2 px-6 rounded-full"
          >
            <Text className="text-white font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-[#FE9F1F] rounded-full items-center justify-center mr-3">
            <Text className="text-white font-bold text-sm">T</Text>
          </View>
          <Text className="text-lg font-bold text-gray-800">
            Tassie Reader
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} className="p-2">
          <Ionicons name="close" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Reading Indicator */}
        <ReadingIndicator isReading={isPlaying} voiceInfo={voiceInfo} />

        {/* OCR Capture */}
        {!showText && !error && (
          <>
            <OcrCapture 
              onTextExtracted={handleTextExtracted}
              onError={handleOcrError}
            />
            
            {/* Test Button for Quick Demo */}
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 m-4">
              <Text className="text-blue-800 font-semibold mb-2">Quick Test</Text>
              <TouchableOpacity
                onPress={() => handleTextExtracted("Hello! This is a test message from Tassie. Let me read this sample text for you to demonstrate the text-to-speech functionality.")}
                className="bg-blue-600 py-2 px-4 rounded-full"
              >
                <Text className="text-white font-medium text-center">Test TTS with Sample Text</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Error State */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
              <Text className="ml-2 text-red-800 font-semibold">
                Oops!
              </Text>
            </View>
            <Text className="text-red-700 mb-3">{error}</Text>
            <TouchableOpacity
              onPress={() => setError(null)}
              className="bg-red-600 py-2 px-4 rounded-full self-start"
            >
              <Text className="text-white font-medium">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Extracted Text Display */}
        {showText && extractedText && (
          <View className="bg-white rounded-lg p-4 m-4 shadow-sm border border-gray-200">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-800">
                Extracted Text
              </Text>
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={handleEditText}
                  className="p-2"
                >
                  <Ionicons name="create-outline" size={20} color="#FE9F1F" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleTryAgain}
                  className="p-2"
                >
                  <Ionicons name="refresh-outline" size={20} color="#FE9F1F" />
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView 
              className="max-h-40 bg-gray-50 rounded-lg p-3 mb-4"
              showsVerticalScrollIndicator={true}
            >
              <Text className="text-gray-800 leading-6">
                {extractedText}
              </Text>
            </ScrollView>

            {/* TTS Controls */}
            <TTSControls
              isPlaying={isPlaying}
              isPaused={isPaused}
              isLoading={isLoading}
              progress={progress}
              onTogglePlayPause={togglePlayPause}
              onStop={stop}
              disabled={!extractedText}
            />

            {/* TTS Error */}
            {ttsError && (
              <View className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Text className="text-yellow-800 text-sm">
                  {ttsError}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Instructions */}
        {!showText && !error && (
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 m-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={20} color="#2563eb" />
              <Text className="ml-2 text-blue-800 font-semibold">
                How it works
              </Text>
            </View>
            <Text className="text-blue-700 text-sm leading-5">
              1. Take a photo of text from a book or document{'\n'}
              2. Tassie will extract the text using smart recognition{'\n'}
              3. Listen as Tassie reads it aloud in her cute voice!{'\n\n'}
              💡 <Text className="font-medium">Tip:</Text> Make sure the text is clear and well-lit for best results.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TassieReader;
