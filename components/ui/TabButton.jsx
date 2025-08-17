import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const TabButton = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 py-3 px-4 rounded-full mx-1 ${
      isActive ? 'bg-white' : 'bg-transparent'
    }`}
  >
    <Text 
      className={`text-center font-medium ${
        isActive ? 'text-white' : 'text-white'
      }`}
      style={isActive ? {color: '#FE9F1F'} : {}}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default TabButton;
