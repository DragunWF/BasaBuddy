import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import { getBookDetails } from "../services/openLibraryService";
import {
  addBookToLibrary,
  addBookToLikedBooks,
  addToBooksRead,
  addBookToCollection,
  getUserCollections,
} from "../helpers/storage/bookStorage";
import { createCollection } from "../helpers/storage/collectionStorage";

const BookDetailsScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showLibraryOptions, setShowLibraryOptions] = useState(false);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [userCollections, setUserCollections] = useState([]);

  useEffect(() => {
    fetchBookDetails();
    loadUserCollections();
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
      console.log("Error fetching book details:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserCollections = async () => {
    try {
      const collections = await getUserCollections();
      setUserCollections(collections || []);
    } catch (err) {
      console.log("Error loading user collections:", err);
    }
  };

  const handleAddToLibrary = () => {
    setShowLibraryOptions(true);
  };

  const handleLibraryOptionSelect = async (option) => {
    try {
      let result;
      let successMessage = "";

      switch (option) {
        case "liked":
          result = await addBookToLikedBooks(bookId);
          successMessage = "Added to Liked Books";
          break;
        case "finished":
          result = await addToBooksRead(bookId);
          successMessage = "Added to Finished Books";
          break;
        case "general":
          result = await addBookToLibrary(bookId);
          successMessage = "Added to Library";
          break;
        default:
          // Handle collection selection
          result = await addBookToCollection(bookId, option);
          successMessage = `Added to ${option}`;
          break;
      }

      if (result.success) {
        Toast.show({
          type: "success",
          text1: successMessage,
          text2: `${book.title} has been added successfully.`,
        });
      } else {
        Toast.show({
          type: "info",
          text1: "Already Added",
          text2:
            result.message || `${book.title} is already in this collection.`,
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add book to collection.",
      });
      console.log("Error adding book to collection:", err);
    } finally {
      setShowLibraryOptions(false);
    }
  };

  const handleCancelNewCollection = () => {
    setNewCollectionName("");
    setShowNewCollectionModal(false);
    setShowLibraryOptions(true);
  };

  const handleCreateNewCollection = async () => {
    if (!newCollectionName.trim()) {
      Alert.alert("Error", "Please enter a collection name.");
      return;
    }

    try {
      const result = await createCollection(newCollectionName.trim());
      if (result.success) {
        await loadUserCollections(); // Refresh collections list
        await addBookToCollection(bookId, newCollectionName.trim());

        Toast.show({
          type: "success",
          text1: "Collection Created",
          text2: `${book.title} added to "${newCollectionName}".`,
        });

        setNewCollectionName("");
        setShowNewCollectionModal(false);
        setShowLibraryOptions(false);
      } else {
        Alert.alert("Error", result.message || "Failed to create collection.");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to create collection.");
      console.log("Error creating collection:", err);
    }
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

      {/* Modals */}
      {showLibraryOptions && (
        <Modal
          visible={showLibraryOptions}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLibraryOptions(false)}
        >
          <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
            <View className="bg-white rounded-xl w-full max-w-sm">
              <View className="p-4 border-b border-gray-200">
                <Text className="text-lg font-bold text-center">
                  Add to Library
                </Text>
              </View>

              <ScrollView className="max-h-96">
                {/* Default options */}
                <TouchableOpacity
                  className="flex-row items-center p-4 border-b border-gray-100"
                  onPress={() => handleLibraryOptionSelect("general")}
                >
                  <Ionicons name="library-outline" size={24} color="#FE9F1F" />
                  <Text className="ml-3 text-base">General Library</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center p-4 border-b border-gray-100"
                  onPress={() => handleLibraryOptionSelect("liked")}
                >
                  <Ionicons name="heart-outline" size={24} color="#FE9F1F" />
                  <Text className="ml-3 text-base">Liked Books</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center p-4 border-b border-gray-100"
                  onPress={() => handleLibraryOptionSelect("finished")}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="#FE9F1F"
                  />
                  <Text className="ml-3 text-base">Finished Books</Text>
                </TouchableOpacity>

                {/* User collections */}
                {userCollections.map((collection, index) => (
                  <TouchableOpacity
                    key={index}
                    className="flex-row items-center p-4 border-b border-gray-100"
                    onPress={() => handleLibraryOptionSelect(collection.name)}
                  >
                    <Ionicons name="folder-outline" size={24} color="#FE9F1F" />
                    <Text className="ml-3 text-base">{collection.name}</Text>
                  </TouchableOpacity>
                ))}

                {/* Create new collection */}
                <TouchableOpacity
                  className="flex-row items-center p-4"
                  onPress={() => {
                    setShowLibraryOptions(false);
                    setShowNewCollectionModal(true);
                  }}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="#FE9F1F"
                  />
                  <Text className="ml-3 text-base font-medium">
                    Create New Collection
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              <TouchableOpacity
                className="p-4 border-t border-gray-200"
                onPress={() => setShowLibraryOptions(false)}
              >
                <Text className="text-center text-gray-500">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {showNewCollectionModal && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelNewCollection}
        >
          <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
            <View className="bg-white rounded-xl w-full max-w-sm">
              <View className="p-4 border-b border-gray-200">
                <Text className="text-lg font-bold text-center">
                  Create New Collection
                </Text>
              </View>

              <View className="p-4">
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
                  placeholder="Enter collection name"
                  value={newCollectionName}
                  onChangeText={setNewCollectionName}
                  autoFocus={true}
                  returnKeyType="done"
                  onSubmitEditing={handleCreateNewCollection}
                  blurOnSubmit={false}
                />

                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    className="flex-1 bg-gray-200 py-2 rounded-lg"
                    onPress={handleCancelNewCollection}
                  >
                    <Text className="text-center text-gray-700">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 bg-[#FE9F1F] py-2 rounded-lg"
                    onPress={handleCreateNewCollection}
                  >
                    <Text className="text-center text-white font-bold">
                      Create
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default BookDetailsScreen;
