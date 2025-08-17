import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const getIconName = (title) => {
  switch (title) {
    case 'Status':
      return 'assessment';
    case 'Timer':
      return 'timer';
    case 'Streak':
      return 'local-fire-department';
    default:
      return 'circle';
  }
};

const TabButton = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-full ${
      isActive ? 'bg-orange-400' : 'bg-transparent'
    }`}
  >
    <Icon 
      name={getIconName(title)} 
      size={20} 
      color={isActive ? 'white' : '#666'} 
      style={{ marginRight: 8 }}
    />
    <Text 
      className={`font-medium ${
        isActive ? 'text-white' : 'text-gray-600'
      }`}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

export default TabButton;
