import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AchievementCard = ({ 
  type = 'exp', 
  value, 
  title, 
  description, 
  iconName = 'checkmark' 
}) => {
  const isExpType = type === 'exp';
  
  return (
    <View className="flex-row items-center bg-white rounded-2xl p-4 mb-4 shadow-lg">
      <View 
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{backgroundColor: isExpType ? '#FE9F1F' : '#10B981'}}
      >
        {isExpType ? (
          <>
            <Text className="text-white text-xl font-bold">{value}</Text>
            <Text className="text-white text-xs">EXP</Text>
          </>
        ) : (
          <Ionicons name={iconName} size={24} color="white" />
        )}
      </View>
      <View className="flex-1">
        <Text className="text-gray-800 font-bold text-lg">{title}</Text>
        <Text className="text-gray-600">{description}</Text>
      </View>
    </View>
  );
};

export default AchievementCard;
