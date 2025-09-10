import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BookCard from "../components/ui/BookCard";
import {
  getBooksInCollection,
  getLikedBooks,
  getBooksRead,
} from "../helpers/storage/bookStorage";
import { getBookDetails } from "../services/openLibraryService";

function CollectionDetailsScreen({ navigation, route }) {
  const { collection } = route.params;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollectionBooks();
  }, []);

  const fetchCollectionBooks = async () => {
    try {
      setLoading(true);
      let bookIds = [];

      // Handle special collections
      if (collection.type === "liked") {
        const likedBooks = await getLikedBooks();
        bookIds = likedBooks.map((book) => book.bookId);
      } else if (collection.type === "finished") {
        const finishedBooks = await getBooksRead();
        bookIds = finishedBooks.map((book) => book.bookId);
      } else {
        // Handle regular collections
        const collectionBooks = await getBooksInCollection(collection.id);
        bookIds = collectionBooks.map((book) => book.bookId);
      }

      // Fetch book details for each book
      const bookDetails = [];
      for (const bookId of bookIds) {
        try {
          const details = await getBookDetails(bookId);
          if (details) {
            bookDetails.push(details);
          }
        } catch (error) {
          console.error(`Error fetching book details for ${bookId}:`, error);
        }
      }

      setBooks(bookDetails);
    } catch (error) {
      console.error("Error fetching collection books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book) => {
    navigation.navigate("BookDetails", { bookId: book.id });
  };

  const getCollectionTitle = () => {
    if (collection.type === "liked") return "Liked Books";
    if (collection.type === "finished") return "Finished Books";
    return collection.title || "Collection";
  };

  const addBookToCollectionHandler = () => {
    navigation.navigate("MainApp", { screen: "Explore" });
  };

  const renderBookItem = ({ item }) => (
    <View className="w-[48%] mb-4">
      <BookCard book={item} onPress={() => handleBookPress(item)} />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#FE9F1F] px-6 pt-12 pb-12 rounded-br-[50px]">
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-14 h-14 bg-[#808080] bg-opacity-30 rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <Text className="text-white text-2xl font-bold">
          {getCollectionTitle()}
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-6">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">Loading books...</Text>
          </View>
        ) : books.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="book-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mt-4">
              No books in this collection
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Add some books to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={books}
            renderItem={renderBookItem}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      {/* Add Book Button */}
      <View className="absolute bottom-8 right-6">
        <TouchableOpacity
          className="w-14 h-14 bg-[#FE9F1F] rounded-full items-center justify-center shadow-lg"
          onPress={addBookToCollectionHandler}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default CollectionDetailsScreen;
