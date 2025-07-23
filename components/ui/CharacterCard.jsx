import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const CharacterCard = ({ name, greetingText }) => {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 relative overflow-hidden h-[278px] shadow-lg">
      <View className="mb-16">
        <Text className="text-2xl font-bold mb-2">{name}</Text>
        <View className="flex-row items-center">
          {/* Mood emoji placeholder - you'll add the actual emoji image */}
          <View className="w-6 h-6 rounded-full bg-yellow-400 mr-2" />
          <View className="h-1.5 w-1/2 bg-gray-200 rounded-full" />
        </View>
      </View>
      
      <View className="items-center justify-center -mt-10">
        <TouchableOpacity className="bg-orange-400 py-2 px-4 rounded-full">
          <Text className="text-white font-bold">{greetingText}</Text>
        </TouchableOpacity>
      </View>
      
      <View className="absolute bottom-0 right-12 w-[120px] h-[120px] justify-end">
        <Image 
          source={require('../../assets/home/tassie.png')} 
          className="w-[120px] h-[120px] rounded-lg" 
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default CharacterCard;
