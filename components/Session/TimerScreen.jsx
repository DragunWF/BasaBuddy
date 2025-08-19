import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CircularProgress } from 'react-native-circular-progress';

const TimerScreen = ({ 
  pomodoroTime, 
  pomodoroMinutes,
  isTimerRunning, 
  dailyProgress, 
  onToggleTimer, 
  onResetTimer,
  onChangePomodoroTime
}) => {
  // Calculate dynamic time values
  const totalPomodoroTime = pomodoroMinutes * 60; // Total time in seconds
  const timeSpent = totalPomodoroTime - pomodoroTime;
  const timeSpentMinutes = Math.floor(timeSpent / 60);
  const totalMinutes = Math.floor(totalPomodoroTime / 60);
  
  // Calculate daily progress time
  const dailyGoalMinutes = 30;
  const dailyCompletedMinutes = Math.floor((dailyProgress / 100) * dailyGoalMinutes);
  
  // Calculate timer progress (how much time has elapsed)
  const timerProgress = ((totalPomodoroTime - pomodoroTime) / totalPomodoroTime) * 100;
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
              <View className="w-64 h-64 rounded-full border-4 border-gray-300 bg-white items-center justify-center shadow-lg">
                <Text className="text-gray-800 text-xl font-medium mb-2">Pomodoro</Text>
                
                {/* Time Display with Controls */}
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => onChangePomodoroTime(Math.max(5, pomodoroMinutes - 5))}
                    disabled={isTimerRunning}
                    className="p-2"
                  >
                    <Ionicons 
                      name="remove" 
                      size={24} 
                      color={isTimerRunning ? "#D1D5DB" : "#374151"} 
                    />
                  </TouchableOpacity>
                  
                  <Text className="text-gray-800 text-6xl font-bold mx-4">
                    {Math.floor(pomodoroTime / 60)}
                  </Text>
                  
                  <TouchableOpacity
                    onPress={() => onChangePomodoroTime(Math.min(60, pomodoroMinutes + 5))}
                    disabled={isTimerRunning}
                    className="p-2"
                  >
                    <Ionicons 
                      name="add" 
                      size={24} 
                      color={isTimerRunning ? "#D1D5DB" : "#374151"} 
                    />
                  </TouchableOpacity>
                </View>
                
                <Text className="text-gray-800 text-xl font-medium">Mins</Text>
              </View>
            )}
          </CircularProgress>
        </View>

        {/* Daily Progress */}
        <View className="w-full bg-white rounded-2xl p-6 mt-8 shadow-lg">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-gray-600">Daily Progress</Text>
              <Text className="text-gray-500 text-sm">August 11, 2025 - 3:00 P.M</Text>
            </View>
            <CircularProgress
              size={64}
              width={4}
              fill={dailyProgress}
              tintColor="#FE9F1F"
              backgroundColor="#E5E7EB"
              rotation={0}
              lineCap="round"
            >
              {() => (
                <Text className="text-gray-800 text-lg font-bold">{dailyProgress}%</Text>
              )}
            </CircularProgress>
          </View>
          <View 
            className="rounded-full px-4 py-2 self-end" 
            style={{backgroundColor: '#FE9F1F'}}
          >
            <Text className="text-white font-medium">{dailyCompletedMinutes} mins / {dailyGoalMinutes} mins</Text>
          </View>
        </View>

        {/* Control Buttons */}
        <View className="flex-row mt-8 space-x-4">
          <TouchableOpacity
            onPress={onToggleTimer}
            className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
            style={{backgroundColor: '#FE9F1F'}}
          >
            <Ionicons 
              name={isTimerRunning ? "pause" : "play"} 
              size={32} 
              color="white" 
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onResetTimer}
            className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
            style={{backgroundColor: '#FE9F1F'}}
          >
            <Ionicons name="stop" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default TimerScreen;
