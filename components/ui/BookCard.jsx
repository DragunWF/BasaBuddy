import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const BookCard = ({ book, onPress }) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-4 shadow-lg relative"
      onPress={onPress}
    >
      {/* Local book indicator */}
      {book?.isLocal && (
        <View className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 z-10">
          <Icon name="download" size={12} color="white" />
        </View>
      )}

      <View className="items-center mb-3">
        <View className="w-24 h-32 bg-gray-300 rounded-lg mb-3">
          {book?.coverUrl ? (
            <Image
              source={{ uri: book.coverUrl }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
              {book?.isLocal ? (
                <Icon name="picture-as-pdf" size={32} color="#DC2626" />
              ) : (
                <Icon name="book" size={32} color="#9CA3AF" />
              )}
            </View>
          )}
        </View>
      </View>

      <Text
        className="text-black font-semibold text-base mb-1"
        numberOfLines={2}
      >
        {book?.title || "Book title"}
      </Text>

      <Text className="text-gray-600 text-sm mb-3">
        {book?.author || "Author"}
      </Text>

      <View className="flex-row items-center justify-between">
        <View className="h-1 bg-orange-400 rounded-full flex-1 mr-3" />
        <Icon
          name={book?.isLocal ? "picture-as-pdf" : "check-circle"}
          size={20}
          color={book?.isLocal ? "#DC2626" : "#FE9F1F"}
        />
      </View>
    </TouchableOpacity>
  );
};

export default BookCard;
