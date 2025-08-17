import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import AchievementCard from '../ui/AchievementCard';

const StatusScreen = () => {
  const userLevel = 10;
  const userExp = 230;
  const userTitle = "Bookworm";
  
  // Calculate EXP progress for next level
  const expForNextLevel = 300; // EXP needed for next level
  const expProgress = (userExp / expForNextLevel) * 100;

  const achievements = [
    {
      type: 'exp',
      value: 20,
      title: 'First Chapter Conqueror',
      description: 'Complete your very first book in BasaBuddy'
    },
    {
      type: 'completed',
      title: 'Page Turner',
      description: 'Finish 5 books — your curiosity is unstoppable!',
      iconName: 'checkmark'
    },
    {
      type: 'exp',
      value: 20,
      title: 'Literary Marathoner',
      description: 'Read 10 books from cover to cover.'
    },
    {
      type: 'completed',
      title: 'Genre Explorer',
      description: 'Complete at least 1 book from 3 different genres.',
      iconName: 'checkmark'
    },
    {
      type: 'exp',
      value: 20,
      title: 'Night Owl Reader',
      description: 'Finish a book after reading mostly at night.'
    },
    {
      type: 'completed',
      title: 'Speed Reader',
      description: 'Complete a book in less than 3 days.',
      iconName: 'checkmark'
    },
    {
      type: 'exp',
      value: 20,
      title: 'Classic Conqueror',
      description: 'Finish a classic literature book.'
    },
    {
      type: 'completed',
      title: 'Series Slayer',
      description: 'Complete all books in a single series.',
      iconName: 'checkmark'
    },
    {
      type: 'exp',
      value: 20,
      title: 'Knowledge Collector',
      description: 'Read 5 non-fiction books in BasaBuddy.'
    },
    {
      type: 'completed',
      title: "Tassie's Best Friend",
      description: "Finish 20 books — Tassie couldn't be prouder!",
      iconName: 'checkmark'
    }
  ];

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
                style={{backgroundColor: '#FE9F1F'}}
              >
                <Text className="text-white text-4xl font-bold mb-2">{userTitle}</Text>
                <Text className="text-white text-8xl font-bold">{userLevel}</Text>
                <Text className="text-white text-xl font-medium">LEVEL</Text>
              </View>
            )}
          </CircularProgress>
          <View className="absolute bottom-2">
            <Text className="text-gray-800 text-sm font-medium">{userExp} EXP</Text>
          </View>
        </View>

        {/* Achievements Section */}
        <View className="w-full mt-12">
          <Text className="text-gray-800 text-2xl font-bold mb-6">Achievements</Text>
          
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={index}
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
