import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BookCard = ({ book, onPress }) => {
  return (
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-4 shadow-lg"
      onPress={onPress}
    >
      <View className="items-center mb-3">
        <View className="w-24 h-32 bg-gray-300 rounded-lg mb-3">
          {book?.coverUrl ? (
            <Image 
              source={{ uri: book.coverUrl }} 
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gray-300 rounded-lg" />
          )}
        </View>
      </View>
      
      <Text className="text-black font-semibold text-base mb-1" numberOfLines={2}>
        {book?.title || 'Book title'}
      </Text>
      
      <Text className="text-gray-600 text-sm mb-3">
        {book?.author || 'Author'}
      </Text>
      
      <View className="flex-row items-center justify-between">
        <View className="h-1 bg-orange-400 rounded-full flex-1 mr-3" />
        <Icon name="check-circle" size={20} color="#FE9F1F" />
      </View>
    </TouchableOpacity>
  );
};

export default BookCard;
