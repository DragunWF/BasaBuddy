import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { performOCR } from '../../services/ocrService';

const OcrCapture = ({ onTextExtracted, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processingStep, setProcessingStep] = useState('');

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to let you select photos!',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to let you take photos!',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const processImageWithTesseract = async (imageUri) => {
    // Tesseract.js doesn't work in React Native due to Web Workers
    // Skip to fallback OCR service
    throw new Error('Tesseract not supported in React Native');
  };

  const processImageWithFallback = async (imageUri) => {
    try {
      setProcessingStep('Using backup text recognition...');
      
      // Convert image to FormData for the existing OCR service
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      
      const text = await performOCR(formData);
      return text;
    } catch (error) {
      console.error('Fallback OCR error:', error);
      throw error;
    }
  };

  const processImage = async (imageUri) => {
    setIsProcessing(true);
    setCapturedImage(imageUri);
    
    try {
      let extractedText = '';
      
      // Try Tesseract.js first (offline, more reliable)
      try {
        extractedText = await processImageWithTesseract(imageUri);
      } catch (tesseractError) {
        console.log('Tesseract failed, trying fallback OCR service...');
        
        // Fallback to existing OCR service
        try {
          extractedText = await processImageWithFallback(imageUri);
        } catch (fallbackError) {
          throw new Error('Both OCR methods failed');
        }
      }
      
      if (!extractedText || extractedText.length < 3) {
        throw new Error('No readable text found in the image');
      }
      
      setProcessingStep('Text extracted successfully!');
      setTimeout(() => {
        onTextExtracted(extractedText);
        setIsProcessing(false);
        setProcessingStep('');
      }, 1000);
      
    } catch (error) {
      console.error('OCR processing error:', error);
      setIsProcessing(false);
      setProcessingStep('');
      setCapturedImage(null);
      
      const errorMessage = error.message.includes('No readable text') 
        ? "Couldn't read that clearly. Try taking another photo with better lighting!"
        : "Oops! I had trouble reading that. Please try again!";
      
      onError(errorMessage);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      onError('Could not access camera. Please try again!');
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      onError('Could not access photo library. Please try again!');
    }
  };

  const showImageSourceOptions = () => {
    Alert.alert(
      'Select Image Source',
      'Choose how you want to add a photo of text for Tassie to read:',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
          style: 'default',
        },
        {
          text: 'Choose from Gallery',
          onPress: pickFromGallery,
          style: 'default',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  if (isProcessing) {
    return (
      <View className="bg-white rounded-lg p-6 m-4 shadow-sm border border-gray-200">
        <View className="items-center">
          {capturedImage && (
            <Image 
              source={{ uri: capturedImage }} 
              className="w-32 h-24 rounded-lg mb-4"
              resizeMode="cover"
            />
          )}
          
          <View className="flex-row items-center mb-3">
            <ActivityIndicator size="small" color="#FE9F1F" />
            <Text className="ml-3 text-gray-700 font-medium">
              Tassie is reading your photo...
            </Text>
          </View>
          
          {processingStep && (
            <Text className="text-sm text-gray-500 text-center">
              {processingStep}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-lg p-4 m-4 shadow-sm border border-gray-200">
      <View className="flex-row items-center mb-3">
        <Ionicons name="camera" size={24} color="#FE9F1F" />
        <Text className="ml-3 text-lg font-semibold text-gray-800">
          Photo to Speech
        </Text>
      </View>
      
      <Text className="text-gray-600 mb-4 text-sm">
        Take a photo of text from a book and let Tassie read it aloud for you!
      </Text>
      
      <TouchableOpacity
        onPress={showImageSourceOptions}
        className="bg-[#FE9F1F] py-3 px-6 rounded-full flex-row items-center justify-center"
        activeOpacity={0.8}
      >
        <Ionicons name="camera-outline" size={20} color="white" />
        <Text className="text-white font-bold ml-2">
          Capture Text
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OcrCapture;
