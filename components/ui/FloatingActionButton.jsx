import React, { useState } from 'react';
import { View, TouchableOpacity, Alert, Text, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';

const FloatingActionButton = ({ activeTab, onBookAdded, onCollectionAdded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const handlePDFUpload = async () => {
    try {
      setIsUploading(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        // Extract book title from filename (remove .pdf extension)
        const bookTitle = result.name.replace(/\.pdf$/i, '');
        
        // Create book object
        const newBook = {
          id: Date.now(), // Simple ID generation
          title: bookTitle,
          author: 'Unknown Author',
          filePath: result.uri,
          fileName: result.name,
          fileSize: result.size,
          dateAdded: new Date().toISOString(),
          coverUrl: null,
          isLocal: true,
        };

        // Call the callback to add the book
        if (onBookAdded) {
          onBookAdded(newBook);
        }

        Alert.alert(
          'Success',
          `"${bookTitle}" has been added to your library!`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert(
        'Error',
        'Failed to upload the PDF. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCollection = () => {
    // For now, just show an alert. You can implement collection creation logic here
    Alert.alert(
      'Add Collection',
      'Collection creation feature coming soon!',
      [{ text: 'OK' }]
    );
    
    if (onCollectionAdded) {
      onCollectionAdded();
    }
  };

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleOptionPress = (action) => {
    setIsExpanded(false);
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    
    // Execute the action after animation
    setTimeout(() => {
      action();
    }, 100);
  };

  const handleGoogleDrive = () => {
    Alert.alert('Google Drive', 'Google Drive integration coming soon!');
  };

  const handleOneDrive = () => {
    Alert.alert('OneDrive', 'OneDrive integration coming soon!');
  };

  const getOptionsForTab = () => {
    if (activeTab === 'books') {
      return [
        {
          icon: 'picture-as-pdf',
          label: 'Upload PDF',
          action: handlePDFUpload,
          color: '#FF6B6B'
        },
        {
          icon: 'cloud',
          label: 'Google Drive',
          action: handleGoogleDrive,
          color: '#4285F4'
        },
        {
          icon: 'cloud-upload',
          label: 'OneDrive',
          action: handleOneDrive,
          color: '#0078D4'
        }
      ];
    } else {
      return [
        {
          icon: 'create-new-folder',
          label: 'New Collection',
          action: handleAddCollection,
          color: '#96CEB4'
        },
        {
          icon: 'import-export',
          label: 'Import Collection',
          action: () => Alert.alert('Import', 'Import collection feature coming soon!'),
          color: '#FFEAA7'
        }
      ];
    }
  };

  const options = getOptionsForTab();

  return (
    <View className="absolute bottom-6 right-6">
      {/* Option Buttons */}
      {options.map((option, index) => {
        const translateY = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(60 * (index + 1))],
        });

        const scale = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });

        return (
          <Animated.View
            key={option.label}
            style={{
              transform: [{ translateY }, { scale }],
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}
          >
            <TouchableOpacity
              className="w-12 h-12 rounded-full items-center justify-center shadow-lg mb-2"
              style={{ backgroundColor: option.color }}
              onPress={() => handleOptionPress(option.action)}
            >
              <Icon name={option.icon} size={20} color="white" />
            </TouchableOpacity>
            {isExpanded && (
              <View className="absolute right-14 top-2 bg-black bg-opacity-80 px-2 py-1 rounded">
                <Text className="text-white text-xs whitespace-nowrap">{option.label}</Text>
              </View>
            )}
          </Animated.View>
        );
      })}

      {/* Main FAB */}
      <TouchableOpacity 
        className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg"
        onPress={toggleExpanded}
        disabled={isUploading}
      >
        <Animated.View
          style={{
            transform: [{
              rotate: animation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '45deg'],
              }),
            }],
          }}
        >
          <Icon 
            name={isUploading ? "hourglass-empty" : "add"} 
            size={28} 
            color="#333" 
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingActionButton;
