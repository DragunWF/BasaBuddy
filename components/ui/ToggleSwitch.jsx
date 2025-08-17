import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ToggleSwitch = ({ activeTab, onTabChange }) => {
  return (
    <View className="bg-white rounded-full p-1 flex-row mb-6 shadow-sm">
      <TouchableOpacity
        className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-full ${
          activeTab === 'books' ? 'bg-orange-400' : 'bg-transparent'
        }`}
        onPress={() => onTabChange('books')}
      >
        <Icon 
          name="book" 
          size={20} 
          color={activeTab === 'books' ? 'white' : '#666'} 
          style={{ marginRight: 8 }}
        />
        <Text className={`font-medium ${
          activeTab === 'books' ? 'text-white' : 'text-gray-600'
        }`}>
          Books
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-full ${
          activeTab === 'collections' ? 'bg-orange-400' : 'bg-transparent'
        }`}
        onPress={() => onTabChange('collections')}
      >
        <Icon 
          name="collections-bookmark" 
          size={20} 
          color={activeTab === 'collections' ? 'white' : '#666'} 
          style={{ marginRight: 8 }}
        />
        <Text className={`font-medium ${
          activeTab === 'collections' ? 'text-white' : 'text-gray-600'
        }`}>
          Collections
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ToggleSwitch;
