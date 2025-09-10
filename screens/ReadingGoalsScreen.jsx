import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { updateReadingGoals } from "../helpers/storage/profileStorage";
import { CATEGORIES } from "../constants/profileSetupInfo";

const ReadingGoalsScreen = ({ navigation }) => {
  const [dailyGoal, setDailyGoal] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([
    "Business",
    "Comic",
    "Health",
  ]);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const timeOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

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
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      if (selectedCategories.length < 3) {
        setSelectedCategories([...selectedCategories, category]);
      }
    }
  };

  const handleSetup = async () => {
    if (!dailyGoal) {
      Toast.show({
        type: "error",
        text1: "Missing Daily Goal",
        text2: "Please select your daily reading goal",
      });
      return;
    }

    if (selectedCategories.length !== 3) {
      Toast.show({
        type: "error",
        text1: "Categories Required",
        text2: "Please select exactly 3 categories",
      });
      return;
    }

    const result = await updateReadingGoals(dailyGoal, selectedCategories);

    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Goals Set",
        text2: "Your reading goals have been saved!",
      });
      navigation.navigate("HomeNavigator");
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not save your reading goals. Please try again.",
      });
    }
  };

  const handleTimeSelect = (time) => {
    setDailyGoal(time);
    setShowTimeSelector(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        <Text className="text-3xl font-bold mt-8 mb-6 text-gray-800">
          Reading Goals
        </Text>

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
                  <Text className="text-5xl font-bold text-gray-800">
                    {dailyGoal}
                  </Text>
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

        {/* Categories Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-medium">Categories</Text>
            <Text className="text-sm text-gray-600">
              {selectedCategories.length}/3
            </Text>
          </View>

          <View className="flex-row flex-wrap">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <TouchableOpacity
                  key={category}
                  className={`m-1 py-2 px-4 rounded-full flex-row items-center ${
                    isSelected ? "bg-orange-400" : "bg-gray-200"
                  }`}
                  onPress={() => toggleCategory(category)}
                >
                  <Text
                    className={`mr-1 ${
                      isSelected ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {category}
                  </Text>
                  <Text className={isSelected ? "text-white" : "text-gray-800"}>
                    {isSelected ? "-" : "+"}
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
          className={`py-4 rounded-lg shadow-md ${
            dailyGoal ? "bg-orange-400" : "bg-gray-300"
          }`}
          style={{ elevation: 3 }}
          onPress={handleSetup}
          disabled={!dailyGoal}
        >
          <Text
            className={`text-center text-lg font-medium ${
              dailyGoal ? "text-white" : "text-gray-500"
            }`}
          >
            Set up
          </Text>
        </TouchableOpacity>
      </View>

      {/* Time Selector Modal - Fixed for iOS */}
      <Modal
        visible={showTimeSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTimeSelector(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setShowTimeSelector(false)}
          />

          <View
            className="bg-white rounded-t-3xl shadow-lg"
            style={{
              height: "70%",
              paddingBottom: 40,
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
              <Text className="text-center text-lg my-4">
                {dailyGoal
                  ? `${dailyGoal} minutes selected`
                  : "Select Reading Time"}
              </Text>

              <View className="items-center">
                {timeOptions.map((time) => (
                  <TouchableOpacity
                    key={time}
                    className={`py-4 w-full ${
                      dailyGoal === time ? "bg-gray-200" : ""
                    }`}
                    onPress={() => handleTimeSelect(time)}
                  >
                    <Text
                      className={`text-center text-lg ${
                        dailyGoal === time ? "font-bold" : ""
                      }`}
                    >
                      {time} minutes
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ReadingGoalsScreen;
