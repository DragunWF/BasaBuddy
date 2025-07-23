import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

const BookSearchResults = ({ books, loading, onBookPress, emptyMessage }) => {
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <ActivityIndicator size="large" color="#FE9F1F" />
        <Text className="mt-4 text-gray-500">Searching for books...</Text>
      </View>
    );
  }

  if (!books || books.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <Text className="text-lg text-gray-500">{emptyMessage || "No books found"}</Text>
      </View>
    );
  }

  const renderBookItem = ({ item }) => (
    <TouchableOpacity 
      className="flex-row bg-white rounded-xl p-4 mb-4 shadow-md"
      onPress={() => onBookPress(item)}
    >
      <View className="mr-4">
        {item.coverUrl ? (
          <Image 
            source={{ uri: item.coverUrl }} 
            className="w-[80px] h-[120px] rounded-md"
            resizeMode="cover"
          />
        ) : (
          <View className="w-[80px] h-[120px] bg-gray-200 rounded-md justify-center items-center">
            <Text className="text-gray-500 text-center px-2">No Cover</Text>
          </View>
        )}
      </View>
      
      <View className="flex-1 justify-center">
        <Text className="text-lg font-bold mb-1" numberOfLines={2}>{item.title}</Text>
        <Text className="text-gray-600 mb-2">{item.author}</Text>
        <View className="flex-row">
          <Text className="text-gray-500 text-sm">Published: {item.publishYear}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Always render items directly in a non-scrolling container to avoid nested scrolling issues
  return (
    <View className="pb-2">
      {books.map((item) => (
        <React.Fragment key={item.id}>
          {renderBookItem({ item })}
        </React.Fragment>
      ))}
    </View>
  );
};

export default BookSearchResults;
