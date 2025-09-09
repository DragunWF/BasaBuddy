import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

const CategoryItem = ({ item, onPress }) => {
  // Icon mapping for categories
  const getIconForCategory = (category) => {
    // Handle both category name and id-based mapping
    const categoryName = category.name ? category.name.toLowerCase() : category.id;
    
    const iconMap = {
      'art': <Icon name="palette" size={24} color="white" />,
      'biographies': <Icon name="person" size={24} color="white" />,
      'business': <Icon name="business" size={24} color="white" />,
      'comic': <Icon name="auto-stories" size={24} color="white" />,
      'cooking': <Icon name="restaurant" size={24} color="white" />,
      'education': <Icon name="school" size={24} color="white" />,
      'health': <Icon name="favorite" size={24} color="white" />,
      'history': <Icon name="history-edu" size={24} color="white" />,
      'horror': <FeatherIcon name="eye" size={24} color="white" />,
      'kids': <Icon name="child-care" size={24} color="white" />,
      'medical': <Icon name="local-hospital" size={24} color="white" />,
      'romance': <Icon name="favorite-border" size={24} color="white" />,
      'fantasy': <FeatherIcon name="zap" size={24} color="white" />,
      'self-help': <Icon name="self-improvement" size={24} color="white" />,
      'sport': <Icon name="sports" size={24} color="white" />,
      'travel': <Icon name="flight" size={24} color="white" />,
      'science': <Icon name="science" size={24} color="white" />,
      'fiction': <Icon name="menu-book" size={24} color="white" />,
      'mystery': <FeatherIcon name="search" size={24} color="white" />,
      'poetry': <FeatherIcon name="feather" size={24} color="white" />,
      'philosophy': <Icon name="psychology" size={24} color="white" />,
      'religion': <Icon name="church" size={24} color="white" />,
      'technology': <Icon name="computer" size={24} color="white" />,
      'music': <Icon name="music-note" size={24} color="white" />
    };
    
    return iconMap[categoryName] || <Icon name="book" size={24} color="white" />;
  };

  return (
    <TouchableOpacity className="flex-1 items-center mx-2 mb-4" onPress={() => onPress(item)}>
      <View 
        className="w-[60px] h-[60px] rounded-xl mb-2 justify-center items-center"
        style={{ backgroundColor: item.color }}
      >
        {getIconForCategory(item)}
      </View>
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
