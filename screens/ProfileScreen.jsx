import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { fetchProfile } from "../helpers/storage/profileStorage";
import { getLikedBooks, getBooksRead } from "../helpers/storage/bookStorage";

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [booksReadCount, setBooksReadCount] = useState(0);
  const [likedBooksCount, setLikedBooksCount] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchProfile();
        const likedBooks = await getLikedBooks();
        const booksRead = await getBooksRead();

        setLikedBooksCount(likedBooks.length);
        setProfile(profileData);
        setBooksReadCount(booksRead.length);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const userData = {
    username: profile
      ? `${profile.getFirstName()} ${profile.getLastName()}`
      : "Username", // Fallback text
    booksRead: booksReadCount,
    likedBooks: likedBooksCount,
    userLevel: 0, // TODO: Implement level system
    todaysReading: 10, // minutes
    longestStreak: 10, // days
    collections: [
      {
        id: "1",
        title: "Collection Title",
        creator: "user",
        coverImage: null, // placeholder for now
      },
    ],
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Show loading state while profile is being fetched
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header with settings */}
        <View className="flex-row justify-between items-center px-4 py-2">
          <TouchableOpacity
            className="w-10 h-10 justify-center items-center rounded-full bg-orange-400"
            onPress={handleBackPress}
          >
            <Text className="text-white font-bold text-lg">B</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 justify-center items-center">
            <Ionicons name="settings-outline" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View className="items-center mt-2">
          <View className="w-24 h-24 rounded-full bg-orange-400 mb-2" />
          <Text className="text-xl font-bold">{userData.username}</Text>
        </View>

        {/* Stats */}
        <View className="flex-row justify-center bg-white rounded-2xl mx-4 mt-4 shadow-lg overflow-hidden">
          <View className="flex-1 items-center py-3 border-r border-gray-200">
            <Text className="text-xl font-bold">{userData.likedBooks}</Text>
            <Text className="text-gray-500 text-sm">Liked Books</Text>
          </View>
          <View className="flex-1 items-center py-3 border-r border-gray-200">
            <Text className="text-xl font-bold">{userData.userLevel}</Text>
            <Text className="text-gray-500 text-sm">Level</Text>
          </View>
          <View className="flex-1 items-center py-3">
            <Text className="text-xl font-bold">{userData.booksRead}</Text>
            <Text className="text-gray-500 text-sm">Books Read</Text>
          </View>
        </View>

        {/* Reading Stats */}
        <View className="bg-orange-400 mx-4 mt-6 rounded-3xl p-4">
          <View className="flex-row justify-between">
            {/* Today's Reading */}
            <View className="bg-white rounded-xl p-3 flex-1 mr-2 shadow-md">
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text className="font-bold">Today's Reading</Text>
                  <View className="flex-row items-baseline">
                    <Text className="text-xl font-bold">
                      {userData.todaysReading}
                    </Text>
                    <Text className="ml-1 text-xs">MINUTES</Text>
                  </View>
                </View>
                <Image
                  source={require("../assets/home/timer.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Longest Streak */}
            <View className="bg-white rounded-xl p-3 flex-1 ml-2 shadow-md">
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text className="font-bold">Longest Streak</Text>
                  <View className="flex-row items-baseline">
                    <Text className="text-xl font-bold">
                      {userData.longestStreak}
                    </Text>
                    <Text className="ml-1 text-xs">DAYS</Text>
                  </View>
                </View>
                <Image
                  source={require("../assets/home/fire.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Collections */}
        <View className="mx-4 mt-6 mb-6">
          {userData.collections.map((collection) => (
            <View
              key={collection.id}
              className="bg-white rounded-xl shadow-md mb-4 overflow-hidden"
            >
              <View className="flex-row">
                <View className="w-24 h-24 bg-gray-200" />
                <View className="p-3 flex-1">
                  <Text className="font-bold text-lg">{collection.title}</Text>
                  <Text className="text-gray-500">By {collection.creator}</Text>
                </View>
              </View>
              <TouchableOpacity className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow items-center justify-center">
                <Text className="text-xl font-bold text-gray-500">+</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
