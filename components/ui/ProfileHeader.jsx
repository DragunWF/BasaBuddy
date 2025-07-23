import React from "react";
import { View, Image, TouchableOpacity } from "react-native";

const ProfileHeader = ({ onProfilePress }) => {
  return (
    <View className="flex-row justify-between items-center px-4 py-3">
      <View className="h-12 w-12 justify-center items-center">
        <Image 
          source={require('../../assets/logo.png')} 
          className="h-15 w-15 rounded-lg"
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity onPress={onProfilePress} className="h-12 w-12 rounded-full bg-gray-200 justify-center items-center">
        {/* Profile icon placeholder - you'll add the actual image */}
        <View className="h-8 w-8 rounded-full bg-gray-400" />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;
