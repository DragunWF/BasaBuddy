import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ReadingListCard = ({
  collection,
  onPress,
  onMenuPress,
  type = "default",
}) => {
  const getIconName = () => {
    if (type === "liked") return "favorite";
    if (type === "finished") return "check";
    return "book";
  };

  const getIconColor = () => {
    if (type === "liked" || type === "finished") return "#FE9F1F";
    return "#FE9F1F";
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-4 shadow-lg"
      onPress={onPress}
    >
      {type === "liked" || type === "finished" ? (
        // Special cards for Liked Books and Finished Books
        <View className="items-center justify-center h-24 mb-4">
          <View className="w-16 h-16 bg-orange-400 rounded-2xl items-center justify-center mb-2">
            <Icon name={getIconName()} size={32} color="white" />
          </View>
        </View>
      ) : (
        // Regular collection card with image placeholder
        <View className="flex-row items-center mb-3">
          <View className="w-16 h-20 bg-gray-300 rounded-lg mr-4" />
          <View className="flex-1">
            <Text className="text-black font-semibold text-base mb-1">
              {collection?.title || "Collection Title"}
            </Text>
            <Text className="text-gray-600 text-sm">
              By {collection?.author || "user"}
            </Text>
          </View>
          <TouchableOpacity onPress={onMenuPress} className="p-2">
            <Icon name="more-vert" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {type === "liked" || type === "finished" ? (
        <View className="items-center">
          <Text className="text-black font-semibold text-base mb-1">
            {type === "liked" ? "Liked Books" : "Finished Books"}
          </Text>
          <Text className="text-gray-600 text-sm mb-2">By user</Text>
          <Text className="text-gray-500 text-sm">
            {collection?.bookCount || "0"}{" "}
            {collection?.bookCount === 1 ? "book" : "books"}
          </Text>
        </View>
      ) : (
        <Text className="text-gray-500 text-sm">
          {collection?.bookCount || "0"}{" "}
          {collection?.bookCount === 1 ? "book" : "books"}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ReadingListCard;
