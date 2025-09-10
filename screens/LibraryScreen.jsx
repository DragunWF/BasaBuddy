import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import BookCard from "../components/ui/BookCard";
import ReadingListCard from "../components/ui/ReadingListCard";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import { Ionicons } from "@expo/vector-icons";

import {
  getLibraryBooks,
  getLikedBooks,
  getBooksRead,
  getBooksInCollection,
} from "../helpers/storage/bookStorage";
import { getBookDetails } from "../services/openLibraryService";
import {
  getCollections,
  deleteCollection,
  updateCollection,
  getCollectionBookCount,
  createCollection,
} from "../helpers/storage/collectionStorage";
import { fetchProfile } from "../helpers/storage/profileStorage";

function LibraryScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("books");
  const [userBooks, setUserBooks] = useState([]);
  const [userCollections, setUserCollections] = useState([]);
  const [author, setAuthor] = useState("User");

  const [likedBooksCount, setLikedBooksCount] = useState(0);
  const [finishedBooksCount, setFinishedBooksCount] = useState(0);

  // State for modals
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // New state for create modal

  // State for text inputs
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [createCollectionName, setCreateCollectionName] = useState(""); // New state for create input

  useFocusEffect(
    useCallback(() => {
      const fetchLibraryBooks = async () => {
        try {
          const books = await getLibraryBooks();
          const displayedBooks = [];
          for (let book of books) {
            displayedBooks.push(await getBookDetails(book.bookId));
          }
          setUserBooks(displayedBooks || []);
        } catch (error) {
          console.log("Error fetching library books:", error);
          Toast.show({
            type: "error",
            text1: "Error fetching library books",
            position: "bottom",
          });
        }
      };
      const fetchCollections = async () => {
        // Fetch all collections and add cover images from the first book in each collection
        try {
          const collections = await getCollections();
          const displayedCollections = [];
          for (let collection of collections) {
            // Get books in this collection to find the first book for cover image
            const booksInCollection = await getBooksInCollection(
              collection.getId()
            );
            let coverImage = null;

            // If collection has books, get the first book's details for cover image
            if (booksInCollection.length > 0) {
              try {
                const firstBook = await getBookDetails(
                  booksInCollection[0].bookId
                );
                coverImage = firstBook.coverUrl;
              } catch (error) {
                console.log(
                  "Error fetching first book details for cover:",
                  error
                );
              }
            }

            displayedCollections.push({
              id: collection.getId(),
              title: collection.getTitle(),
              author: "You",
              bookCount: await getCollectionBookCount(collection.getId()),
              coverImage: coverImage, // Added cover image from first book in collection
            });
          }
          setUserCollections(displayedCollections);
        } catch (error) {
          console.log("Error fetching collections:", error);
          Toast.show({
            type: "error",
            text1: "Error fetching collections",
            position: "bottom",
          });
        }
      };
      const fetchSpecialCollections = async () => {
        try {
          const likedBooks = await getLikedBooks();
          const finishedBooks = await getBooksRead();
          setLikedBooksCount(likedBooks.length);
          setFinishedBooksCount(finishedBooks.length);
        } catch (error) {
          console.log(
            "Error fetching liked and finished book collections:",
            error
          );
          Toast.show({
            type: "error",
            text1: "Error fetching liked and finished book collections!",
            position: "bottom",
          });
        }
      };
      const fetchProfileName = async () => {
        try {
          const profileData = await fetchProfile();
          setAuthor(
            profileData
              ? `${profileData.getFirstName()} ${profileData.getLastName()}`
              : "Username"
          );
        } catch (error) {
          console.log("Error loading profile name:", error);
          Toast.show({
            type: "error",
            text1: "Error loading profile name",
            position: "bottom",
          });
        }
      };

      fetchLibraryBooks();
      fetchCollections();
      fetchSpecialCollections();
      fetchProfileName();
    }, [])
  );

  const allBooks = [...userBooks];
  const allCollections = [...userCollections];

  const handleBookPress = (book) => {
    navigation.navigate("BookDetails", { bookId: book.id });
  };

  const handleCollectionPress = (collection) => {
    navigation.navigate("CollectionDetails", { collection });
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

      Toast.show({
        type: "success",
        text1: "Collection deleted successfully!",
        position: "bottom",
      });
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

        Toast.show({
          type: "success",
          text1: "Collection renamed successfully!",
          position: "bottom",
        });
      } catch (error) {
        console.error("Rename collection error:", error);
      }
    }
  };

  const handleBookAdded = (newBook) => {
    setUserBooks((prevBooks) => [...prevBooks, newBook]);
  };

  // --- New and Updated Handlers ---
  const handleCollectionAdded = () => {
    setShowCreateModal(true); // Open the create modal
  };

  const handleCreateCollection = async () => {
    if (createCollectionName && createCollectionName.trim()) {
      try {
        const createCollectionResponse = await createCollection(
          createCollectionName.trim()
        );
        if (!createCollectionResponse.success) {
          Toast.show({
            type: "error",
            text1: "Failed to create collection",
            position: "bottom",
          });
          setShowCreateModal(false);
          return;
        }
        const newCollection = createCollectionResponse.collection;
        const formattedCollection = {
          id: newCollection.getId(),
          title: newCollection.getTitle(),
          author: author,
          bookCount: 0,
          coverImage: null, // New collections start with no cover image
        };
        setUserCollections((prev) => [...prev, formattedCollection]);
        setShowCreateModal(false);
        setCreateCollectionName("");
        Toast.show({
          type: "success",
          text1: "Collection created successfully!",
          position: "bottom",
        });
      } catch (error) {
        console.error("Create collection error:", error);
        Toast.show({
          type: "error",
          text1: "Failed to create collection",
          position: "bottom",
        });
      }
    }
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
              {allBooks.map((book) => (
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

      {/* --- New Create Collection Modal --- */}
      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
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
                value={createCollectionName}
                onChangeText={setCreateCollectionName}
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={handleCreateCollection}
              />

              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-200 py-2 rounded-lg"
                  onPress={() => {
                    setShowCreateModal(false);
                    setCreateCollectionName("");
                  }}
                >
                  <Text className="text-center text-gray-700">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-[#FE9F1F] py-2 rounded-lg"
                  onPress={handleCreateCollection}
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
    </SafeAreaView>
  );
}

export default LibraryScreen;
