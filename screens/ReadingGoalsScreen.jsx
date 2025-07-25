import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const CATEGORIES = [
  'Arts', 'Biography', 'Business', 'Cooking', 'Comic', 'Travel',
  'Edu', 'Health', 'History', 'Horror', 'Kid', 'Medical',
  'Romance', 'Fantasy', 'Self-Help', 'Sport'
];

const ReadingGoalsScreen = ({ navigation }) => {
  const [dailyGoal, setDailyGoal] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(['Business', 'Comic', 'Health']);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const timeOptions = [20, 25, 30, 35, 40];
  
  // Create pan responder for swipe down to close
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        // If swiped down, close the popup
        if (gestureState.dy > 50) {
          setShowTimeSelector(false);
        }
      },
    })
  ).current;

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      if (selectedCategories.length < 3) {
        setSelectedCategories([...selectedCategories, category]);
      }
    }
  };

  const handleSetup = () => {
    // Save reading goals to user profile or context
    // Then navigate to the main app
    navigation.navigate('HomeNavigator');
  };

  const handleTimeSelect = (time) => {
    setDailyGoal(time);
    setShowTimeSelector(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        <Text className="text-3xl font-bold mt-8 mb-6 text-gray-800">Reading Goals</Text>
        
        {/* Daily Reading Goal Circle */}
        <View className="items-center mb-8">
          <TouchableOpacity 
            className="w-36 h-36 rounded-full bg-white shadow-lg items-center justify-center"
            style={{ elevation: 4 }}
            onPress={() => setShowTimeSelector(!showTimeSelector)}
          >
            <View className="w-32 h-32 rounded-full border-4 border-orange-400 items-center justify-center">
              {dailyGoal ? (
                <>
                  <Text className="text-base text-gray-800 mb-1">Daily</Text>
                  <Text className="text-5xl font-bold text-gray-800">{dailyGoal}</Text>
                  <Text className="text-base text-gray-800 mt-1">Mins</Text>
                </>
              ) : (
                <>
                <Text className="text-base text-gray-800 mb-1">Daily</Text>

                <Text className="text-5xl font-bold text-gray-800">+</Text>
                <Text className="text-base text-gray-800 mt-1">Mins</Text>
</>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Time Selector Popup */}
        {showTimeSelector && (
          <View 
            className="absolute left-0 right-0 bottom-[-60%] bg-white rounded-t-3xl shadow-lg z-50" 
            style={{ 
              elevation: 5,
              height: '70%',
              paddingBottom: 80 // Add extra padding to avoid overlapping with Set up button
            }}
          >
            <View className="items-center pt-4" {...panResponder.panHandlers}>
              <TouchableOpacity 
                className="w-16 h-8 items-center justify-center" 
                onPress={() => setShowTimeSelector(false)}
              >
                <View className="w-16 h-1 bg-gray-300 rounded-full"></View>
              </TouchableOpacity>
            </View>
            
            <ScrollView className="px-6 flex-1">
              <Text className="text-center text-lg my-4">{dailyGoal || 'Select Reading Time'}</Text>
              
              <View className="items-center">
                {timeOptions.map((time) => (
                  <TouchableOpacity
                    key={time}
                    className={`py-3 w-full ${dailyGoal === time ? 'bg-gray-200' : ''}`}
                    onPress={() => handleTimeSelect(time)}
                  >
                    <Text className={`text-center text-lg ${dailyGoal === time ? 'font-bold' : ''}`}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Categories Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-medium">Categories</Text>
            <Text className="text-sm text-gray-600">{selectedCategories.length}/3</Text>
          </View>
          
          <View className="flex-row flex-wrap">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <TouchableOpacity
                  key={category}
                  className={`m-1 py-2 px-4 rounded-full flex-row items-center ${
                    isSelected ? 'bg-orange-400' : 'bg-gray-200'
                  }`}
                  onPress={() => toggleCategory(category)}
                >
                  <Text className={`mr-1 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                    {category}
                  </Text>
                  <Text className={isSelected ? 'text-white' : 'text-gray-800'}>
                    {isSelected ? '-' : '+'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Setup Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          className={`py-4 rounded-lg shadow-md ${dailyGoal ? 'bg-orange-400' : 'bg-gray-300'}`}
          style={{ elevation: 3 }}
          onPress={handleSetup}
          disabled={!dailyGoal}
        >
          <Text className={`text-center text-lg font-medium ${dailyGoal ? 'text-white' : 'text-gray-500'}`}>Set up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ReadingGoalsScreen;
