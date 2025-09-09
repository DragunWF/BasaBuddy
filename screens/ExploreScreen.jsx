import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { searchBooks, getBooksBySubject } from "../services/openLibraryService";

// Category component for the horizontal scrolling categories
const CategoryItem = ({ icon, title, onPress }) => (
  <TouchableOpacity className="items-center mx-2 w-16" onPress={onPress}>
    <View
      className="w-14 h-14 rounded-lg justify-center items-center"
      style={{ backgroundColor: icon.color }}
    >
      {icon.component}
    </View>
    <Text className="text-xs mt-1 text-center">{title}</Text>
  </TouchableOpacity>
);

// Book item component for the vertical list of books
const BookItem = ({ book, onPress }) => (
  <TouchableOpacity
    className="flex-row mb-4 items-center"
    onPress={() => onPress(book)}
  >
    <View className="mr-3">
      {book.coverUrl ? (
        <Image
          source={{ uri: book.coverUrl }}
          className="w-16 h-20 rounded-md"
          resizeMode="cover"
        />
      ) : (
        <View className="w-16 h-20 bg-gray-200 rounded-md justify-center items-center">
          <Text className="text-gray-500 text-xs text-center">No Cover</Text>
        </View>
      )}
    </View>

    <View className="flex-1">
      <Text className="font-semibold" numberOfLines={1}>
        {book.title}
      </Text>
      <Text className="text-xs text-gray-600" numberOfLines={1}>
        {book.author}
      </Text>

      <View className="flex-row items-center mt-1">
        <Ionicons name="eye-outline" size={14} color="#666" />
        <Text className="text-xs text-gray-500 ml-1">10,000</Text>
      </View>
    </View>
  </TouchableOpacity>
);

function ExploreScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState("fiction");

  // Pagination state
  const [searchPage, setSearchPage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);
  const [searchPagination, setSearchPagination] = useState(null);
  const [popularPagination, setPopularPagination] = useState(null);
  const ITEMS_PER_PAGE = 10;

  // Categories data
  const categories = [
    {
      id: "art",
      title: "Art",
      icon: {
        component: <MaterialIcons name="palette" size={20} color="white" />,
        color: "#FF8C42",
      },
    },
    {
      id: "biographies",
      title: "Biographies",
      icon: {
        component: <MaterialIcons name="person" size={20} color="white" />,
        color: "#FE9F1F",
      },
    },
    {
      id: "business",
      title: "Business",
      icon: {
        component: <MaterialIcons name="business" size={20} color="white" />,
        color: "#FF7F00",
      },
    },
    {
      id: "comic",
      title: "Comic",
      icon: {
        component: <MaterialIcons name="auto-stories" size={20} color="white" />,
        color: "#FF6B35",
      },
    },
    {
      id: "cooking",
      title: "Cooking",
      icon: {
        component: <MaterialIcons name="restaurant" size={20} color="white" />,
        color: "#FF8500",
      },
    },
    {
      id: "fiction",
      title: "Fiction",
      icon: {
        component: <MaterialIcons name="menu-book" size={20} color="white" />,
        color: "#FF7F50",
      },
    },
  ];

  // Fetch books by category when component mounts or category changes
  useEffect(() => {
    fetchBooksByCategory(activeCategory);
  }, [activeCategory]);

  const fetchBooksByCategory = async (category, page = 1, reset = true) => {
    try {
      setLoading(true);
      // Get books from selected category with pagination
      const response = await getBooksBySubject(category, page, ITEMS_PER_PAGE);

      if (reset || page === 1) {
        setPopularBooks(response.books);
      } else {
        setPopularBooks((prevBooks) => [...prevBooks, ...response.books]);
      }

      setPopularPagination(response.pagination);
      setPopularPage(page);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching books",
        text2: "Please try again later.",
      });
      console.error(`Error fetching ${category} books:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId) => {
    setActiveCategory(categoryId);
    setPopularPage(1);
  };

  const handleSearch = async (page = 1, reset = false) => {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const response = await searchBooks(searchQuery, page, ITEMS_PER_PAGE);

      if (reset || page === 1) {
        setSearchResults(response.books);
      } else {
        setSearchResults((prevResults) => [...prevResults, ...response.books]);
      }

      setSearchPagination(response.pagination);
      setSearchPage(page);
    } catch (error) {
      console.error("Error searching books:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleBookPress = (book) => {
    navigation.navigate("BookDetails", { bookId: book.id });
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        {/* Header with search */}
        <View className="bg-[#FE9F1F] pt-10 pb-4 px-4">
          <View className="flex-row items-center mb-2">
            <Text className="text-white text-2xl font-bold">B</Text>
          </View>

          <View className="flex-row bg-white rounded-full px-2 items-center shadow-sm">
            <TextInput
              className="flex-1 py-2 px-3 text-gray-800"
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(1, true)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="p-2"
              >
                <Ionicons name="close-circle" size={18} color="#888" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => handleSearch(1, true)}
              className="p-2"
            >
              <Ionicons name="search" size={20} color="#FE9F1F" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1 bg-gray-100"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Categories */}
          <View className="bg-white py-4 mb-3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
            >
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  icon={category.icon}
                  title={category.title}
                  onPress={() => handleCategoryPress(category.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Display search results or popular books */}
          {searching && searchResults.length === 0 ? (
            <View className="justify-center items-center py-8">
              <ActivityIndicator size="large" color="#FE9F1F" />
              <Text className="mt-4 text-gray-500">Searching for books...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <View className="px-4 py-2">
              <Text className="text-lg font-semibold mb-4">Search Results</Text>
              {searchResults.map((book, index) => (
                <BookItem
                  key={`search-${book.id || index}`}
                  book={book}
                  onPress={handleBookPress}
                />
              ))}
            </View>
          ) : (
            <View className="px-4 py-2">
              {loading && popularBooks.length === 0 ? (
                <View className="justify-center items-center py-8">
                  <ActivityIndicator size="large" color="#FE9F1F" />
                  <Text className="mt-4 text-gray-500">Loading books...</Text>
                </View>
              ) : (
                <>
                  {popularBooks.map((book, index) => (
                    <BookItem
                      key={`popular-${book.id || index}`}
                      book={book}
                      onPress={handleBookPress}
                    />
                  ))}

                  {loading && (
                    <View className="items-center py-4">
                      <ActivityIndicator size="small" color="#FE9F1F" />
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default ExploreScreen;
