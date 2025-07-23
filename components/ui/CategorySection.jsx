import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

const CategoryItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity className="flex-1 items-center mx-2 mb-4" onPress={() => onPress(item)}>
      {/* Category icon placeholder - you'll add the actual icon */}
      <View 
        className="w-[60px] h-[60px] rounded-xl mb-2 justify-center items-center"
        style={{ backgroundColor: item.color }}
      />
      <Text className="text-xs text-center">{item.name}</Text>
    </TouchableOpacity>
  );
};

const CategorySection = ({ categories, onCategoryPress, onViewAllPress }) => {
  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center mb-4 px-4">
        <Text className="text-xl font-bold">Categories</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text className="text-orange-400 font-bold">View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryItem item={item} onPress={onCategoryPress} />
        )}
        keyExtractor={(item) => item.id}
        horizontal={false}
        numColumns={5}
        scrollEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </View>
  );
};

export default CategorySection;
