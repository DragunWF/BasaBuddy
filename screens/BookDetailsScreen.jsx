import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getBookDetails } from "../services/openLibraryService";
import Toast from "react-native-toast-message";

const BookDetailsScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const bookData = await getBookDetails(bookId);
      setBook(bookData);
      setError(null);
    } catch (err) {
      setError("Failed to load book details. Please try again.");
      Toast.show({
        type: "error",
        text1: "Error fetching book details",
        text2: "Please try again.",
      });
      console.error("Error fetching book details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToLibrary = () => {
    // Logic to add book to user's library
    Toast.show({
      type: "success",
      text1: "Added to Library",
      text2: `${book.title} has been added to your library.`,
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 pt-10">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FE9F1F" />
          <Text className="mt-4 text-gray-500">Loading book details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !book) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 pt-10">
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 mb-4">{error || "Book not found"}</Text>
          <TouchableOpacity
            className="bg-[#FE9F1F] py-2 px-4 rounded-full"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-10">
      <ScrollView className="flex-1">
        {/* Header with back button */}
        <View className="flex-row items-center px-4 py-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold flex-1" numberOfLines={1}>
            Book Details
          </Text>
        </View>

        {/* Book cover and basic info */}
        <View className="flex-row px-4 py-4">
          <View className="mr-4">
            {book.coverUrl ? (
              <Image
                source={{ uri: book.coverUrl }}
                className="w-[120px] h-[180px] rounded-lg shadow-md"
                resizeMode="cover"
              />
            ) : (
              <View className="w-[120px] h-[180px] bg-gray-200 rounded-lg justify-center items-center shadow-md">
                <Text className="text-gray-500 text-center px-2">No Cover</Text>
              </View>
            )}
          </View>

          <View className="flex-1">
            <Text className="text-2xl font-bold mb-2">{book.title}</Text>
            <Text className="text-gray-600 mb-4">
              Published: {book.publishDate}
            </Text>

            {/* Add to Library button */}
            <TouchableOpacity
              className="bg-[#FE9F1F] py-2 px-4 rounded-full mb-2 flex-row items-center justify-center"
              onPress={handleAddToLibrary}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-bold ml-1">Add to Library</Text>
            </TouchableOpacity>

            {/* Start Reading button */}
            <TouchableOpacity
              className="bg-white border border-[#FE9F1F] py-2 px-4 rounded-full flex-row items-center justify-center"
              onPress={() => navigation.navigate("Reading", { book })}
            >
              <Ionicons name="book-outline" size={20} color="#FE9F1F" />
              <Text className="text-[#FE9F1F] font-bold ml-1">
                Start Reading
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View className="px-4 py-4 bg-white mx-4 rounded-xl shadow-sm mb-4">
          <Text className="text-lg font-bold mb-2">Description</Text>
          <Text className="text-gray-700">{book.description}</Text>
        </View>

        {/* Subjects/Categories */}
        {book.subjects && book.subjects.length > 0 && (
          <View className="px-4 py-4 bg-white mx-4 rounded-xl shadow-sm mb-4">
            <Text className="text-lg font-bold mb-2">Categories</Text>
            <View className="flex-row flex-wrap">
              {book.subjects.slice(0, 8).map((subject, index) => (
                <View
                  key={index}
                  className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
                >
                  <Text className="text-sm text-gray-700">{subject}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookDetailsScreen;
