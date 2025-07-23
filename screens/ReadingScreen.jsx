import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getBookContent } from '../services/openLibraryService';

const ReadingScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const [loading, setLoading] = useState(true);
  const [bookData, setBookData] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [fontSize, setFontSize] = useState('medium');
  const [showChapterList, setShowChapterList] = useState(false);
  
  useEffect(() => {
    fetchBookContent();
  }, [book]);
  
  const fetchBookContent = async () => {
    try {
      setLoading(true);
      const content = await getBookContent(book.id);
      setBookData(content);
      
      if (!content.isFullVersion) {
        // Show a notification if only preview is available
        Alert.alert(
          "Preview Only",
          "This book is not available for full reading. Only a preview is shown.",
          [{ text: "OK", onPress: () => {} }]
        );
      }
    } catch (error) {
      console.error('Error loading book content:', error);
      Alert.alert(
        "Error",
        "Could not load book content. Please try again later.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };
  
  const nextChapter = () => {
    if (bookData && currentChapter < bookData.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      // Scroll to top when changing chapters
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
      }
    }
  };
  
  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      // Scroll to top when changing chapters
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
      }
    }
  };
  
  const changeFontSize = (size) => {
    setFontSize(size);
  };
  
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-xl';
      default: return 'text-base';
    }
  };
  
  const toggleChapterList = () => {
    setShowChapterList(!showChapterList);
  };
  
  const selectChapter = (index) => {
    setCurrentChapter(index);
    setShowChapterList(false);
    // Scroll to top when changing chapters
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };
  
  // Create a ref for the ScrollView
  const scrollViewRef = React.useRef(null);
  
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 pt-10">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FE9F1F" />
          <Text className="mt-4 text-gray-500">Loading book content...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!bookData || !bookData.chapters || bookData.chapters.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 pt-10">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={48} color="#FE9F1F" />
          <Text className="mt-4 text-lg text-center">No content available for this book.</Text>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="mt-6 bg-[#FE9F1F] py-2 px-6 rounded-full"
          >
            <Text className="text-white font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const currentContent = bookData.chapters[currentChapter];
  
  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-10">
      {/* Header with controls */}
      <View className="flex-row justify-between items-center px-4 py-2 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleChapterList} className="flex-row items-center">
          <Text className="text-lg font-bold mr-1" numberOfLines={1}>
            {currentContent.title || `Chapter ${currentChapter + 1}`}
          </Text>
          <Ionicons name={showChapterList ? "chevron-up" : "chevron-down"} size={16} color="black" />
        </TouchableOpacity>
        
        <View className="flex-row">
          <TouchableOpacity onPress={() => changeFontSize('small')} className="p-2">
            <Text className={`text-sm ${fontSize === 'small' ? 'text-[#FE9F1F]' : 'text-gray-500'}`}>A</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeFontSize('medium')} className="p-2">
            <Text className={`text-base ${fontSize === 'medium' ? 'text-[#FE9F1F]' : 'text-gray-500'}`}>A</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeFontSize('large')} className="p-2">
            <Text className={`text-lg ${fontSize === 'large' ? 'text-[#FE9F1F]' : 'text-gray-500'}`}>A</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Chapter list dropdown */}
      {showChapterList && (
        <ScrollView className="max-h-60 bg-white border-b border-gray-200">
          {bookData.chapters.map((chapter, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => selectChapter(index)}
              className={`px-6 py-3 border-b border-gray-100 ${index === currentChapter ? 'bg-gray-100' : ''}`}
            >
              <Text className={`${index === currentChapter ? 'font-bold text-[#FE9F1F]' : ''}`}>
                {chapter.title || `Chapter ${index + 1}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      
      {/* Book content */}
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-6 py-8 bg-white"
      >
        {!bookData.isFullVersion && (
          <View className="mb-6 p-4 bg-gray-100 rounded-lg">
            <Text className="italic text-gray-600">Preview only. Full book not available.</Text>
          </View>
        )}
        
        <Text className={`${getFontSizeClass()} text-gray-800`}>
          {currentContent.content}
        </Text>
      </ScrollView>
      
      {/* Chapter navigation */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity 
          onPress={prevChapter} 
          disabled={currentChapter === 0}
          className={`p-2 ${currentChapter === 0 ? 'opacity-50' : ''}`}
        >
          <Ionicons name="chevron-back" size={24} color="#FE9F1F" />
        </TouchableOpacity>
        
        <Text className="text-gray-600">
          Chapter {currentChapter + 1} of {bookData.chapters.length}
        </Text>
        
        <TouchableOpacity 
          onPress={nextChapter} 
          disabled={currentChapter === bookData.chapters.length - 1}
          className={`p-2 ${currentChapter === bookData.chapters.length - 1 ? 'opacity-50' : ''}`}
        >
          <Ionicons name="chevron-forward" size={24} color="#FE9F1F" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ReadingScreen;
