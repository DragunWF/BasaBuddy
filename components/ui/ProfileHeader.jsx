import React from "react";
import { View, Image, TouchableOpacity } from "react-native";

const ProfileHeader = ({ onProfilePress }) => {
  return (
    <View className="flex-row justify-between items-center px-4 py-3">
      <View className="h-10 w-10 justify-center items-center">
        {/* Logo placeholder - you'll add the actual image */}
        <View className="h-9 w-9 bg-orange-400 rounded-lg" />
      </View>
      <TouchableOpacity onPress={onProfilePress} className="h-10 w-10 rounded-full bg-gray-200 justify-center items-center">
        {/* Profile icon placeholder - you'll add the actual image */}
        <View className="h-6 w-6 rounded-full" />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;
