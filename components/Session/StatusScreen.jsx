import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { CircularProgress } from "react-native-circular-progress";
import Toast from "react-native-toast-message";

import AchievementCard from "../ui/AchievementCard";
import { getAchievements } from "../../helpers/storage/achievementStorage";
import {
  getLevel,
  getLevelTitle,
  getExperience,
} from "../../helpers/storage/experienceStorage";

const StatusScreen = () => {
  const [achievements, setAchievements] = useState([]);
  const [userLevel, setUserLevel] = useState(10);
  const [userExp, setUserExp] = useState(230);
  const [userTitle, setUserTitle] = useState("Bookworm");

  // Calculate EXP progress for next level
  const expForNextLevel = (userLevel + 1) * 100;
  const expProgress = (userExp / expForNextLevel) * 100;

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const fetchedAchievements = await getAchievements();
        const displayedAchievements = [];
        for (let achievement of fetchedAchievements) {
          displayedAchievements.push({
            id: achievement.getId(),
            type: achievement.getCompleted() ? "completed" : "exp",
            value: achievement.getExpCount(),
            title: achievement.getTitle(),
            description: achievement.getDescription(),
            iconName: achievement.getCompleted() ? "checkmark" : null,
          });
        }
        setAchievements(displayedAchievements);
      } catch (error) {
        console.log("Error fetching achievements:", error);
        Toast.show({
          type: "error",
          text1: "Error fetching achievements",
          position: "bottom",
        });
      }
    }
    async function fetchLevel() {
      try {
        const fetchedLevel = await getLevel();
        const fetchedTitle = await getLevelTitle();
        const fetchedExp = await getExperience();

        setUserLevel(fetchedLevel);
        setUserTitle(fetchedTitle);
        setUserExp(fetchedExp);
      } catch (err) {
        console.log("Error fetching level: ", err);
        Toast.show({
          type: "error",
          text1: "Error fetching level and title",
          position: "bottom",
        });
      }
    }

    fetchAchievements();
    fetchLevel();
  }, []);

  return (
    <ScrollView className="flex-1 px-6">
      <View className="items-center mt-8">
        {/* Level Circle with EXP Progress Arc */}
        <View className="relative items-center">
          <CircularProgress
            size={280}
            width={8}
            fill={expProgress}
            tintColor="#FE9F1F"
            backgroundColor="#E5E7EB"
            rotation={200}
            arcSweepAngle={320}
            lineCap="round"
          >
            {() => (
              <View
                className="w-64 h-64 rounded-full border-4 border-gray-800 items-center justify-center"
                style={{ backgroundColor: "#FE9F1F" }}
              >
                <Text className="text-white text-2xl font-bold mb-2">
                  {userTitle}
                </Text>
                <Text className="text-white text-8xl font-bold">
                  {userLevel}
                </Text>
                <Text className="text-white text-xl font-medium">LEVEL</Text>
              </View>
            )}
          </CircularProgress>
          <View className="absolute bottom-2">
            <Text className="text-gray-800 text-sm font-medium">
              {userExp} EXP
            </Text>
          </View>
        </View>

        {/* Achievements Section */}
        <View className="w-full mt-12">
          <Text className="text-gray-800 text-2xl font-bold mb-6">
            Achievements
          </Text>

          {achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id || index}
              type={achievement.type}
              value={achievement.value}
              title={achievement.title}
              description={achievement.description}
              iconName={achievement.iconName}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default StatusScreen;
