import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import BookCard from "../components/ui/BookCard";
import ReadingListCard from "../components/ui/ReadingListCard";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import FloatingActionButton from "../components/ui/FloatingActionButton";

import { getLibraryBooks } from "../helpers/storage/bookStorage";
import { getBookDetails } from "../services/openLibraryService";
import { getCollections } from "../helpers/storage/collectionStorage";
import { fetchProfile } from "../helpers/storage/profileStorage";

function LibraryScreen() {
  const [activeTab, setActiveTab] = useState("books");
  const [author, setAuthor] = useState();
  const [userBooks, setUserBooks] = useState([]);
  const [userCollections, setUserCollections] = useState([]);

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
          bookCount: 1,
        });
      }
      setUserCollections(displayedCollections);
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
  }, []);

  const allBooks = [...userBooks];
  const allCollections = [...userCollections];

  const handleBookPress = (book) => {
    // Navigate to book details or reading screen
    console.log("Book pressed:", book);
  };

  const handleCollectionPress = (collection) => {
    // Navigate to collection details
    console.log("Collection pressed:", collection);
  };

  const handleMenuPress = (collection) => {
    // Show menu options (Delete, Rename, etc.)
    console.log("Menu pressed for:", collection);
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
                    collection={{ bookCount: 1 }}
                    onPress={() => handleCollectionPress({ type: "liked" })}
                  />
                </View>
                <View className="w-[48%]">
                  <ReadingListCard
                    type="finished"
                    collection={{ bookCount: 1 }}
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
    </SafeAreaView>
  );
}

export default LibraryScreen;
