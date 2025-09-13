import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { getBooksBySubject } from "../services/openLibraryService";

const BookItem = ({ book, onPress }) => {
  // Generate random view count for demonstration
  const viewCount = Math.floor(Math.random() * 50000) + 1000;

  return (
    <TouchableOpacity
      className="flex-row bg-white mx-4 mb-3 p-4 rounded-xl shadow-sm"
      onPress={() => onPress(book)}
    >
      {/* Book Cover */}
      <View className="w-16 h-20 bg-gray-200 rounded-lg mr-4 overflow-hidden">
        {book.coverUrl ? (
          <Image
            source={{ uri: book.coverUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gray-300 justify-center items-center">
            <Icon name="book" size={20} color="#666" />
          </View>
        )}
      </View>

      {/* Book Info */}
      <View className="flex-1">
        <Text
          className="text-base font-semibold text-gray-900 mb-1"
          numberOfLines={2}
        >
          {book.title}
        </Text>
        <Text className="text-sm text-gray-600 mb-2" numberOfLines={1}>
          {book.author}
        </Text>
        <View className="flex-row items-center">
          <Icon name="eye" size={14} color="#666" />
          <Text className="text-xs text-gray-500 ml-1">
            {viewCount.toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CategoryDetailScreen = ({ navigation, route }) => {
  const { category } = route.params;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Category descriptions for better UX
  const categoryDescriptions = {
    art: "Explore the world of creativity, visual arts, and artistic expression.",
    biographies: "Life stories of remarkable people who shaped our world.",
    business:
      "Insights into entrepreneurship, management, and business strategy.",
    comic: "Graphic novels, comics, and illustrated storytelling.",
    cooking: "Culinary adventures, recipes, and food culture.",
    education: "Learning resources and educational methodologies.",
    health: "Wellness, medical knowledge, and healthy living guides.",
    history: "Journey through time and discover past civilizations.",
    horror: "Spine-chilling tales and supernatural stories.",
    kids: "Delightful stories and educational content for children.",
    medical: "Medical knowledge, healthcare, and scientific research.",
    romance: "Love stories and romantic adventures.",
    fantasy: "Magical worlds and extraordinary adventures.",
    "self-help": "Personal development and self-improvement guides.",
    sport: "Athletic achievements and sports culture.",
    travel: "Explore destinations and travel experiences.",
    science: "Scientific discoveries and technological innovations.",
    fiction: "Imaginative stories and literary works.",
    mystery: "Puzzling cases and thrilling investigations.",
    poetry: "Beautiful verses and poetic expressions.",
    philosophy: "Deep thoughts and philosophical inquiries.",
    religion: "Spiritual texts and religious studies.",
    technology: "Innovation, computing, and digital transformation.",
    music: "Musical theory, history, and artist biographies.",
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async (pageNum = 1, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await getBooksBySubject(
        category.subject || category.id,
        pageNum,
        20
      );

      if (isLoadMore) {
        setBooks((prevBooks) => [...prevBooks, ...response.books]);
      } else {
        setBooks(response.books);
      }

      setHasMore(response.pagination.hasNextPage);
      setPage(pageNum);
    } catch (err) {
      console.error("Error loading books:", err);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadBooks(page + 1, true);
    }
  };

  const handleBookPress = (book) => {
    navigation.navigate("BookDetails", { bookId: book.id });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderBook = ({ item }) => (
    <BookItem book={item} onPress={handleBookPress} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#FE9F1F" />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FE9F1F" />
          <Text className="mt-4 text-gray-600">Loading books...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-4">
          <Icon name="alert-circle" size={48} color="#EF4444" />
          <Text className="text-lg font-semibold text-gray-900 mt-4 text-center">
            {error}
          </Text>
          <TouchableOpacity
            className="bg-[#FE9F1F] px-6 py-3 rounded-lg mt-4"
            onPress={() => loadBooks()}
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header with gradient background */}
      <LinearGradient
        colors={["#FE9F1F", "#FF8C42"]}
        className="px-4 py-6 pb-8"
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={handleBackPress}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-4"
          >
            <Icon name="chevron-left" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="px-2">
          <Text className="text-2xl font-bold text-white mb-2">
            {category.name || category.subject}
          </Text>
          <Text className="text-white/90 text-sm leading-5">
            {categoryDescriptions[category.subject || category.id] ||
              "Discover amazing books in this category."}
          </Text>
        </View>
      </LinearGradient>

      {/* Books List */}
      <View className="flex-1 mt-4">
        <FlatList
          data={books}
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Icon name="book-open" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 text-center mt-4">
                No books found in this category.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default CategoryDetailScreen;
