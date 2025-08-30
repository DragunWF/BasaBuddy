import React, { useState, useCallback } from "react";
import { ScrollView, View, Text, Image } from "react-native";
import { CircularProgress } from "react-native-circular-progress";
import { useFocusEffect } from "@react-navigation/native";

import CalendarGrid from "../ui/CalendarGrid";
import {
  getCurrentStreak,
  getMonthlyReadingDays,
} from "../../helpers/storage/streakStorage";

const StreakScreen = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [completedDays, setCompletedDays] = useState([]);
  const [partialDays, setPartialDays] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadStreak = async () => {
        const streak = await getCurrentStreak();
        setCurrentStreak(streak);

        const today = new Date();
        const { completedDates, partialDates } = await getMonthlyReadingDays(
          today.getFullYear(),
          today.getMonth()
        );
        setCompletedDays(completedDates);
        setPartialDays(partialDates);
      };

      loadStreak();
    }, [])
  );

  // Calculate streak progress (assuming 30 days is the goal)
  const streakGoal = 30;
  const streakProgress = (currentStreak / streakGoal) * 100;

  return (
    <ScrollView className="flex-1 px-6">
      <View className="items-center mt-8">
        {/* Streak Circle with Fire and Progress Arc */}
        <View className="relative items-center">
          <CircularProgress
            size={280}
            width={2}
            fill={streakProgress}
            backgroundColor="black"
            rotation={200}
            arcSweepAngle={320}
            lineCap="round"
          >
            {() => (
              <View className="w-64 h-64 rounded-full  items-center justify-center">
                <Image
                  source={require("../../assets/home/fire.png")}
                  className="w-32 h-32 mb-4"
                  resizeMode="contain"
                />
              </View>
            )}
          </CircularProgress>
          <View className="absolute bottom-0">
            <Text className="text-6xl font-bold" style={{ color: "#FE9F1F" }}>
              {currentStreak}
            </Text>
            <Text className="text-gray-800 text-xl font-medium text-center">
              {currentStreak === 1 ? "Day" : "Days"}
            </Text>
          </View>
        </View>

        {/* Calendar */}
        <CalendarGrid
          currentDay={new Date().getDate()}
          month={new Date().toLocaleString("default", { month: "long" })}
          completedDays={completedDays}
          partialDays={partialDays}
        />
      </View>
    </ScrollView>
  );
};

export default StreakScreen;
