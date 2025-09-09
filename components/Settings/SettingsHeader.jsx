import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const SettingsHeader = ({ onBackPress }) => {
  return (
    <View className="bg-[#FE9F1F] pt-12 pb-8 px-6 rounded-b-[40px]">
      <View className="flex-row items-center">
        <TouchableOpacity 
          onPress={onBackPress}
          className="w-10 h-10 rounded-full bg-black/10 items-center justify-center mr-4"
        >
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Settings</Text>
      </View>
    </View>
  );
};

export default SettingsHeader;
