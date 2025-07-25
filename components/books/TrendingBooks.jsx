import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getBooksBySubject } from "../../services/openLibraryService";

const TrendingBookItem = ({ book, onPress }) => (
  <TouchableOpacity className="mr-4 w-36" onPress={() => onPress(book)}>
    <View className="mb-2">
      {book.coverUrl ? (
        <Image
          source={{ uri: book.coverUrl }}
          className="w-36 h-48 rounded-lg"
          resizeMode="cover"
        />
      ) : (
        <View className="w-36 h-48 bg-gray-200 rounded-lg justify-center items-center">
          <Text className="text-gray-500 text-xs text-center">No Cover</Text>
        </View>
      )}
    </View>

    <Text className="font-semibold text-white" numberOfLines={1}>
      {book.title}
    </Text>
    <Text className="text-xs text-white opacity-80" numberOfLines={1}>
      {book.author}
    </Text>

    <View className="flex-row items-center mt-1">
      <Ionicons name="eye-outline" size={14} color="white" />
      <Text className="text-xs text-white opacity-80 ml-1">10,000</Text>

      <View className="flex-1 flex-row justify-end">
        <TouchableOpacity className="bg-white/30 rounded-full px-3 py-1">
          <Text className="text-xs text-white">Read</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const TrendingBooks = ({ onBookPress, navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingBooks();
  }, []);

  const fetchTrendingBooks = async () => {
    try {
      setLoading(true);
      // Get popular fiction books as trending
      const response = await getBooksBySubject("fiction", 1, 10);
      setBooks(response.books);
    } catch (error) {
      console.error("Error fetching trending books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book) => {
    if (onBookPress) {
      onBookPress(book);
    } else if (navigation) {
      navigation.navigate("BookDetails", { bookId: book.id });
    }
  };

  const handleViewAllPress = () => {
    if (navigation) {
      navigation.navigate("Explore");
    }
  };

  return (
    <View className="mt-6 pb-6">
      <View className="px-4 flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold">Trending Books</Text>
        <TouchableOpacity onPress={handleViewAllPress}>
          <Text className="text-[#FE9F1F]">See All</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-[#FE9F1F] py-6 px-4 rounded-tr-[30px] rounded-br-[30px]">
        {loading ? (
          <View className="h-48 justify-center items-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
          <View>
            {books.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 12 }}
              >
                {books.map((book, index) => (
                  <TrendingBookItem
                    key={`trending-${book.id || index}`}
                    book={book}
                    onPress={handleBookPress}
                  />
                ))}
              </ScrollView>
            ) : (
              <View className="h-48 justify-center items-center">
                <Text className="text-white">No trending books available</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default TrendingBooks;
