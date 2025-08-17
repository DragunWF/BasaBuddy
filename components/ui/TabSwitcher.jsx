import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TabSwitcher = ({ tabs, activeTab, onTabChange, className = "" }) => {
  const getIconName = (tabKey, iconName) => {
    // If iconName is provided in tab config, use it
    if (iconName) return iconName;
    
    // Default icons based on common tab names
    switch (tabKey.toLowerCase()) {
      case 'status':
        return 'assessment';
      case 'timer':
        return 'timer';
      case 'streak':
        return 'local-fire-department';
      case 'books':
        return 'book';
      case 'collections':
        return 'collections-bookmark';
      default:
        return 'circle';
    }
  };

  return (
    <View className={`bg-white rounded-full p-1 flex-row shadow-sm ${className}`}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-full ${
            activeTab === tab.key ? 'bg-orange-400' : 'bg-transparent'
          }`}
          onPress={() => onTabChange(tab.key)}
        >
          <Icon 
            name={getIconName(tab.key, tab.icon)} 
            size={20} 
            color={activeTab === tab.key ? 'white' : '#666'} 
            style={{ marginRight: 8 }}
          />
          <Text className={`font-medium ${
            activeTab === tab.key ? 'text-white' : 'text-gray-600'
          }`}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabSwitcher;
