import React from "react";
import { View, Text, Image } from "react-native";

const StatCard = ({ title, value, unit, image }) => {
  return (
    <View className="bg-white rounded-2xl p-6 mb-4 flex-row justify-between h-[132px] shadow-lg">
      <View className="flex-1 pr-10">
        <Text className="text-2xl font-bold mb-2">{title}</Text>
        <View className="flex-col">
          <Text className="text-2xl font-bold">{value}</Text>
          <Text className="text-sm text-gray-500">{unit}</Text>
        </View>
      </View>
      <View className="relative justify-center items-center">
        <Image
          source={image}
          className="absolute right-[-20px] w-[80px] h-[80px]"
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default StatCard;
