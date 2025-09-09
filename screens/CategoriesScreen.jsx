import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { getAllCategories, searchCategories } from '../services/openLibraryService';

const CategoryCard = ({ category, onPress }) => {
  // Icon mapping for categories
  const getIconForCategory = (categoryId) => {
    const iconMap = {
      'art': <MaterialIcon name="palette" size={20} color="white" />,
      'biographies': <MaterialIcon name="person" size={20} color="white" />,
      'business': <MaterialIcon name="business" size={20} color="white" />,
      'comic': <MaterialIcon name="auto-stories" size={20} color="white" />,
      'cooking': <MaterialIcon name="restaurant" size={20} color="white" />,
      'education': <MaterialIcon name="school" size={20} color="white" />,
      'health': <MaterialIcon name="favorite" size={20} color="white" />,
      'history': <MaterialIcon name="history-edu" size={20} color="white" />,
      'horror': <Icon name="eye" size={20} color="white" />,
      'kids': <MaterialIcon name="child-care" size={20} color="white" />,
      'medical': <MaterialIcon name="local-hospital" size={20} color="white" />,
      'romance': <MaterialIcon name="favorite-border" size={20} color="white" />,
      'fantasy': <Icon name="zap" size={20} color="white" />,
      'self-help': <MaterialIcon name="self-improvement" size={20} color="white" />,
      'sport': <MaterialIcon name="sports" size={20} color="white" />,
      'travel': <MaterialIcon name="flight" size={20} color="white" />,
      'science': <MaterialIcon name="science" size={20} color="white" />,
      'fiction': <MaterialIcon name="menu-book" size={20} color="white" />,
      'mystery': <Icon name="search" size={20} color="white" />,
      'poetry': <Icon name="feather" size={20} color="white" />,
      'philosophy': <MaterialIcon name="psychology" size={20} color="white" />,
      'religion': <MaterialIcon name="church" size={20} color="white" />,
      'technology': <MaterialIcon name="computer" size={20} color="white" />,
      'music': <MaterialIcon name="music-note" size={20} color="white" />
    };
    
    return iconMap[categoryId] || <MaterialIcon name="book" size={20} color="white" />;
  };

  return (
    <TouchableOpacity
      className="flex-1 m-2 items-center"
      onPress={() => onPress(category)}
    >
      <View 
        className="w-16 h-16 rounded-2xl mb-2 justify-center items-center"
        style={{ backgroundColor: category.color }}
      >
        {getIconForCategory(category.id)}
      </View>
      <Text className="text-xs text-center text-gray-700 font-medium">
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const CategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Filter categories when search query changes
    const filtered = searchCategories(categories, searchQuery);
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category) => {
    // Navigate to CategoryDetailScreen with the selected category
    navigation.navigate('CategoryDetail', { 
      category: category
    });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderCategory = ({ item, index }) => {
    return (
      <CategoryCard 
        category={item} 
        onPress={handleCategoryPress}
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FE9F1F" />
          <Text className="mt-4 text-gray-600">Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white">
        <TouchableOpacity
          onPress={handleBackPress}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4"
        >
          <Icon name="chevron-left" size={20} color="#666" />
        </TouchableOpacity>
        
        {/* Search Bar */}
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <TextInput
            className="flex-1 text-base text-gray-700"
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Icon name="search" size={20} color="#FE9F1F" />
        </View>
      </View>

      {/* Categories Title */}
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-gray-900">Categories</Text>
      </View>

      {/* Categories Grid */}
      <FlatList
        data={filteredCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-center">
              {searchQuery ? 'No categories found matching your search.' : 'No categories available.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default CategoriesScreen;
