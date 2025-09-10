import React from "react";
import { View, Text } from "react-native";

const SettingsSection = ({ title, children }) => {
  return (
    <View className="mb-6">
      <Text className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-3 px-6">
        {title}
      </Text>
      <View className="bg-white">{children}</View>
    </View>
  );
};

export default SettingsSection;
