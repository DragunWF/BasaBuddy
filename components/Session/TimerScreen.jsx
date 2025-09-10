import React, { useState, useCallback } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { CircularProgress } from "react-native-circular-progress";
import Slider from "@react-native-community/slider";
import {
  saveReadingSession,
  getTodayReadingTime,
  getDailyGoal,
} from "../../helpers/storage/timerStorage";

const TimerScreen = ({
  pomodoroTime,
  pomodoroMinutes,
  isTimerRunning,
  dailyProgress,
  onToggleTimer,
  onResetTimer,
  onChangePomodoroTime,
}) => {
  const [dailyGoal, setDailyGoal] = useState(20); // In minutes
  const [todayMinutes, setTodayMinutes] = useState(0);

  useFocusEffect(
    useCallback(() => {
      // Load daily goal and today's reading time
      const loadData = async () => {
        const goal = await getDailyGoal();
        const todayTime = await getTodayReadingTime();
        setDailyGoal(goal);
        setTodayMinutes(todayTime);
      };
      loadData();
    }, [])
  );

  // Calculate dynamic time values (MOVED UP)
  const totalPomodoroTime = pomodoroMinutes * 60; // Total time in seconds
  const timeSpent = totalPomodoroTime - pomodoroTime;
  const timeSpentMinutes = Math.floor(timeSpent / 60);
  const totalMinutes = Math.floor(totalPomodoroTime / 60);

  // Calculate timer progress (how much time has elapsed)
  const timerProgress =
    totalPomodoroTime > 0
      ? ((totalPomodoroTime - pomodoroTime) / totalPomodoroTime) * 100
      : 0;

  // Modified reset handler to save the session
  const handleResetTimer = async () => {
    if (timeSpent > 0) {
      const minutesCompleted = Math.floor(timeSpent / 60);
      await saveReadingSession(minutesCompleted);

      // Refresh today's total
      const todayTime = await getTodayReadingTime();
      setTodayMinutes(todayTime);
    }
    onResetTimer();
  };

  // Update daily progress calculation
  const dailyProgressPercent =
    dailyGoal > 0 ? Math.min((todayMinutes / dailyGoal) * 100, 100) : 0;

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  /**
   * Handle slider value changes for Pomodoro timer
   * Converts slider value to minutes and updates the timer
   * @param {number} value - Slider value in minutes (5-60)
   */
  const handleSliderChange = (value) => {
    // Round to nearest 5-minute increment for better UX
    const roundedValue = Math.round(value / 5) * 5;
    onChangePomodoroTime(roundedValue);
  };

  return (
    <ScrollView className="flex-1 px-6">
      <View className="items-center mt-8">
        {/* Timer Circle with Progress Arc */}
        <View className="relative items-center">
          <CircularProgress
            size={280}
            width={4}
            fill={timerProgress}
            tintColor="#FE9F1F"
            backgroundColor="#E5E7EB"
            rotation={0}
            lineCap="round"
          >
            {() => (
              /* Timer Circle Content */
              <View className="w-64 h-64 rounded-full border-4 border-gray-300 bg-white items-center justify-center shadow-lg">
                <Text className="text-gray-800 text-xl font-medium mb-2">
                  Pomodoro
                </Text>

                {/* Time Display - Simplified without controls */}
                <Text className="text-gray-800 text-5xl font-bold">
                  {formatTime(pomodoroTime)}
                </Text>

                {/* Timer duration label */}
                <Text className="text-gray-600 text-sm mt-2">
                  {pomodoroMinutes} minutes
                </Text>
              </View>
            )}
          </CircularProgress>
        </View>

        {/* Timer Duration Slider */}
        <View className="w-full bg-white rounded-2xl p-6 mt-6 shadow-lg">
          <Text className="text-gray-800 text-lg font-semibold mb-4 text-center">
            Timer Duration
          </Text>

          {/* Slider with minute markers */}
          <View className="px-4">
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={5}
              maximumValue={60}
              step={1}
              value={pomodoroMinutes}
              onValueChange={handleSliderChange}
              minimumTrackTintColor="#FE9F1F"
              maximumTrackTintColor="#E5E7EB"
              thumbStyle={{
                backgroundColor: "#FE9F1F",
                width: 24,
                height: 24,
              }}
              trackStyle={{
                height: 6,
                borderRadius: 3,
              }}
              disabled={isTimerRunning}
            />

            {/* Slider labels */}
            <View className="flex-row justify-between mt-2 px-1">
              <Text className="text-gray-500 text-xs">5 min</Text>
              <Text className="text-gray-600 text-sm font-medium">
                {pomodoroMinutes} min
              </Text>
              <Text className="text-gray-500 text-xs">60 min</Text>
            </View>
          </View>

          {/* Quick preset buttons */}
          <View className="flex-row justify-center space-x-3 mt-4">
            {[15, 25, 45].map((preset) => (
              <TouchableOpacity
                key={preset}
                onPress={() => onChangePomodoroTime(preset)}
                disabled={isTimerRunning}
                className={`px-4 py-2 rounded-full ${
                  pomodoroMinutes === preset ? "bg-orange-500" : "bg-gray-200"
                } ${isTimerRunning ? "opacity-50" : ""}`}
              >
                <Text
                  className={`text-sm font-medium ${
                    pomodoroMinutes === preset ? "text-white" : "text-gray-600"
                  }`}
                >
                  {preset}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Progress */}
        <View className="w-full bg-white rounded-2xl p-6 mt-6 shadow-lg">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-gray-600">Daily Progress</Text>
              <Text className="text-gray-500 text-sm">
                {new Date().toLocaleDateString()} -{" "}
                {new Date().toLocaleTimeString()}
              </Text>
            </View>
            <CircularProgress
              size={64}
              width={4}
              fill={dailyProgressPercent}
              tintColor="#FE9F1F"
              backgroundColor="#E5E7EB"
              rotation={0}
              lineCap="round"
            >
              {() => (
                <Text className="text-gray-800 text-lg font-bold">
                  {Math.round(dailyProgressPercent)}%
                </Text>
              )}
            </CircularProgress>
          </View>
          <View
            className="rounded-full px-4 py-2 self-end"
            style={{ backgroundColor: "#FE9F1F" }}
          >
            <Text className="text-white font-medium">
              {todayMinutes} mins / {dailyGoal} mins
            </Text>
          </View>
        </View>

        {/* Control Buttons with increased spacing */}
        <View className="flex-row mt-8 space-x-12 justify-center">
          <TouchableOpacity
            onPress={onToggleTimer}
            className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
            style={{ backgroundColor: "#FE9F1F" }}
          >
            <Ionicons
              name={isTimerRunning ? "pause" : "play"}
              size={32}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleResetTimer}
            className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
            style={{ backgroundColor: "#FE9F1F" }}
          >
            <Ionicons name="stop" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default TimerScreen;
