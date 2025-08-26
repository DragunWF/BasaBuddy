import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import BookCard from "../components/ui/BookCard";
import ReadingListCard from "../components/ui/ReadingListCard";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import { Ionicons } from "@expo/vector-icons";

import {
  getLibraryBooks,
  getLikedBooks,
  getBooksRead,
} from "../helpers/storage/bookStorage";
import { getBookDetails } from "../services/openLibraryService";
import {
  getCollections,
  deleteCollection,
  updateCollection,
  getCollectionBookCount,
} from "../helpers/storage/collectionStorage";

function LibraryScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("books");
  const [userBooks, setUserBooks] = useState([]);
  const [userCollections, setUserCollections] = useState([]);

  const [likedBooksCount, setLikedBooksCount] = useState(0);
  const [finishedBooksCount, setFinishedBooksCount] = useState(0);

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState("");

  useEffect(() => {
    const fetchLibraryBooks = async () => {
      const books = await getLibraryBooks();
      const displayedBooks = [];
      for (let book of books) {
        displayedBooks.push(await getBookDetails(book.bookId));
      }
      setUserBooks(displayedBooks || []);
    };
    const fetchCollections = async () => {
      const collections = await getCollections();
      const displayedCollections = [];
      for (let collection of collections) {
        displayedCollections.push({
          id: collection.getId(),
          title: collection.getTitle(),
          author: "You",
          bookCount: getCollectionBookCount(collection.getId()),
        });
      }
      setUserCollections(displayedCollections);
    };
    const fetchSpecialCollections = async () => {
      const likedBooks = await getLikedBooks();
      const finishedBooks = await getBooksRead();
      setLikedBooksCount(likedBooks.length);
      setFinishedBooksCount(finishedBooks.length);
    };
    const fetchProfile = async () => {
      const profileData = await fetchProfile();
      setAuthor(
        profileData
          ? `${profileData.getFirstName()} ${profileData.getLastName()}`
          : "Username"
      );
    };

    fetchLibraryBooks();
    fetchCollections();
    fetchSpecialCollections();
  }, []);

  const allBooks = [...userBooks];
  const allCollections = [...userCollections];

  const handleBookPress = (book) => {
    navigation.navigate("BookDetails", { bookId: book.id });
  };

  const handleCollectionPress = (collection) => {
    // Navigate to collection details
    console.log("Collection pressed:", collection);
  };

  const handleMenuPress = (collection) => {
    setSelectedCollection(collection);
    setShowOptionsModal(true);
  };

  const handleDeleteCollection = async () => {
    try {
      await deleteCollection(selectedCollection.id);
      setUserCollections((prevCollections) =>
        prevCollections.filter((c) => c.id !== selectedCollection.id)
      );
      setShowOptionsModal(false);
      setSelectedCollection(null);
    } catch (error) {
      console.error("Delete collection error:", error);
    }
  };

  const handleRenameCollection = async () => {
    if (newCollectionName && newCollectionName.trim()) {
      try {
        await updateCollection(selectedCollection.id, {
          title: newCollectionName.trim(),
        });
        setUserCollections((prevCollections) =>
          prevCollections.map((c) =>
            c.id === selectedCollection.id
              ? { ...c, title: newCollectionName.trim() }
              : c
          )
        );
        setShowRenameModal(false);
        setShowOptionsModal(false);
        setSelectedCollection(null);
        setNewCollectionName("");
      } catch (error) {
        console.error("Rename collection error:", error);
      }
    }
  };

  const handleBookAdded = (newBook) => {
    setUserBooks((prevBooks) => [...prevBooks, newBook]);
  };

  const handleCollectionAdded = () => {
    // Handle collection creation logic here
    console.log("Collection added");
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-400 pt-10">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-white text-3xl font-bold mb-2">
            {activeTab === "books" ? "Library" : "Collection"}
          </Text>
          <Text className="text-white text-base opacity-90">
            Welcome to your own collection of books!
          </Text>
        </View>

        {/* Toggle Switch */}
        <ToggleSwitch activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Section */}
        <View className="mb-6">
          <Text className="text-white text-xl font-semibold mb-4">
            {activeTab === "books" ? "Books" : "Reading List"}
          </Text>

          {activeTab === "books" ? (
            /* Books Grid */
            <View className="flex-row flex-wrap justify-between">
              {allBooks.map((book, index) => (
                <View key={book.id} className="w-[48%]">
                  <BookCard book={book} onPress={() => handleBookPress(book)} />
                </View>
              ))}
            </View>
          ) : (
            /* Collections List */
            <View>
              {/* Special Collections */}
              <View className="flex-row justify-between mb-4">
                <View className="w-[48%]">
                  <ReadingListCard
                    type="liked"
                    collection={{ bookCount: likedBooksCount }}
                    onPress={() => handleCollectionPress({ type: "liked" })}
                  />
                </View>
                <View className="w-[48%]">
                  <ReadingListCard
                    type="finished"
                    collection={{ bookCount: finishedBooksCount }}
                    onPress={() => handleCollectionPress({ type: "finished" })}
                  />
                </View>
              </View>

              {/* Regular Collections */}
              {allCollections.map((collection) => (
                <ReadingListCard
                  key={collection.id}
                  collection={collection}
                  onPress={() => handleCollectionPress(collection)}
                  onMenuPress={() => handleMenuPress(collection)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton
        activeTab={activeTab}
        onBookAdded={handleBookAdded}
        onCollectionAdded={handleCollectionAdded}
      />

      {/* Collection Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
          <View className="bg-white rounded-xl w-full max-w-sm">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-center">
                Collection Options
              </Text>
            </View>

            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-100"
              onPress={() => {
                setShowOptionsModal(false);
                setShowRenameModal(true);
                setNewCollectionName(selectedCollection?.title || "");
              }}
            >
              <Ionicons name="pencil-outline" size={24} color="#FE9F1F" />
              <Text className="ml-3 text-base">Rename Collection</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-100"
              onPress={handleDeleteCollection}
            >
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              <Text className="ml-3 text-base text-red-600">
                Delete Collection
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-4"
              onPress={() => setShowOptionsModal(false)}
            >
              <Text className="text-center text-gray-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Rename Collection Modal */}
      <Modal
        visible={showRenameModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRenameModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
          <View className="bg-white rounded-xl w-full max-w-sm">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-center">
                Rename Collection
              </Text>
            </View>

            <View className="p-4">
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
                placeholder="Enter new collection name"
                value={newCollectionName}
                onChangeText={setNewCollectionName}
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={handleRenameCollection}
              />

              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-200 py-2 rounded-lg"
                  onPress={() => {
                    setShowRenameModal(false);
                    setNewCollectionName("");
                  }}
                >
                  <Text className="text-center text-gray-700">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-[#FE9F1F] py-2 rounded-lg"
                  onPress={handleRenameCollection}
                >
                  <Text className="text-center text-white font-bold">
                    Rename
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default LibraryScreen;
