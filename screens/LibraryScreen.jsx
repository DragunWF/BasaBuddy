import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BookCard from '../components/ui/BookCard';
import ReadingListCard from '../components/ui/ReadingListCard';
import ToggleSwitch from '../components/ui/ToggleSwitch';

function LibraryScreen() {
  const [activeTab, setActiveTab] = useState('books');

  // Sample data - replace with actual data from your store/API
  const sampleBooks = [
    { id: 1, title: 'Book title', author: 'Author', coverUrl: null },
    { id: 2, title: 'Book title', author: 'Author', coverUrl: null },
    { id: 3, title: 'Book title', author: 'Author', coverUrl: null },
    { id: 4, title: 'Book title', author: 'Author', coverUrl: null },
  ];

  const sampleCollections = [
    { id: 1, title: 'Collection Title', author: 'user', bookCount: 1 },
    { id: 2, title: 'Collection Title', author: 'user', bookCount: 1 },
  ];

  const handleBookPress = (book) => {
    // Navigate to book details or reading screen
    console.log('Book pressed:', book);
  };

  const handleCollectionPress = (collection) => {
    // Navigate to collection details
    console.log('Collection pressed:', collection);
  };

  const handleMenuPress = (collection) => {
    // Show menu options (Delete, Rename, etc.)
    console.log('Menu pressed for:', collection);
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-400 pt-10">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-white text-3xl font-bold mb-2">
            {activeTab === 'books' ? 'Library' : 'Collection'}
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
            {activeTab === 'books' ? 'Books' : 'Reading List'}
          </Text>

          {activeTab === 'books' ? (
            /* Books Grid */
            <View className="flex-row flex-wrap justify-between">
              {sampleBooks.map((book, index) => (
                <View key={book.id} className="w-[48%]">
                  <BookCard 
                    book={book} 
                    onPress={() => handleBookPress(book)}
                  />
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
                    onPress={() => handleCollectionPress({ type: 'liked' })}
                  />
                </View>
                <View className="w-[48%]">
                  <ReadingListCard 
                    type="finished"
                    collection={{ bookCount: 1 }}
                    onPress={() => handleCollectionPress({ type: 'finished' })}
                  />
                </View>
              </View>

              {/* Regular Collections */}
              {sampleCollections.map((collection) => (
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
      <TouchableOpacity 
        className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg"
        onPress={() => {
          if (activeTab === 'books') {
            // Handle add book
            console.log('Add book pressed');
          } else {
            // Handle add collection
            console.log('Add collection pressed');
          }
        }}
      >
        <Icon name="add" size={28} color="dark" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default LibraryScreen;
