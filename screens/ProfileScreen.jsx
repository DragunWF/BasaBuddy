import * as ImagePicker from "expo-image-picker";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { updateProfilePicture } from "../helpers/storage/profileStorage";

import { fetchProfile } from "../helpers/storage/profileStorage";
import { getLikedBooks, getBooksRead } from "../helpers/storage/bookStorage";
import { getCollections } from "../helpers/storage/collectionStorage";
import { getLevel } from "../helpers/storage/experienceStorage";
import { getTodayReadingTime } from "../helpers/storage/timerStorage";
import { getCurrentStreak } from "../helpers/storage/streakStorage";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [profile, setProfile] = useState(null);
  const [booksReadCount, setBooksReadCount] = useState(0);
  const [likedBooksCount, setLikedBooksCount] = useState(0);
  const [todayReadingTime, setTodayReadingTime] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [userCollections, setUserCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchProfile();
        const likedBooks = await getLikedBooks();
        const booksRead = await getBooksRead();
        const level = await getLevel();

        setLikedBooksCount(likedBooks.length);
        setProfile(profileData);
        setUserLevel(level);
        setBooksReadCount(booksRead.length);
      } catch (error) {
        console.log("Error loading profile:", error);
        Toast.show({
          type: "error",
          text1: "Error loading profile",
          position: "bottom",
        });
      } finally {
        setLoading(false);
      }
    };
    const loadCollections = async () => {
      try {
        const collections = await getCollections();
        const displayedCollections = [];
        for (let collection of collections) {
          displayedCollections.push({
            id: collection.getId(),
            title: collection.getTitle(),
            creator: `${profile ? profile.getFirstName() : "user"}`,
            coverImage: null, // Placeholder for now
          });
        }
        setUserCollections(displayedCollections);
      } catch (error) {
        console.log("Error loading collections:", error);
        Toast.show({
          type: "error",
          text1: "Error loading collections",
          position: "bottom",
        });
      }
    };
    const loadTodayReadingTime = async () => {
      try {
        const minutes = await getTodayReadingTime();
        setTodayReadingTime(minutes);
      } catch (error) {
        console.log("Error loading today's reading time: ", error);
        Toast.show({
          type: "error",
          text1: "Error loading today's reading time",
          position: "bottom",
        });
      }
    };
    const loadCurrentStreak = async () => {
      try {
        const streak = await getCurrentStreak();
        setCurrentStreak(streak);
      } catch (error) {
        console.log("Error loading the current streak: ", error);
        Toast.show({
          type: "error",
          text1: "Error loading the current streak",
          position: "bottom",
        });
      }
    };

    loadProfile();
    loadCollections();
    loadTodayReadingTime();
    loadCurrentStreak();
  }, []);

  const userData = {
    username: profile
      ? `${profile.getFirstName()} ${profile.getLastName()}`
      : "Username", // Fallback text
    booksRead: booksReadCount,
    likedBooks: likedBooksCount,
    userLevel,
    todaysReading: todayReadingTime, // minutes
    currentStreak: currentStreak, // days
    collections: userCollections,
  };

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || libraryStatus !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission required",
        text2:
          "Please grant camera and photo library permissions to update your profile picture.",
        position: "bottom",
      });
      return false;
    }
    return true;
  };

  const handleImageSelection = async (useCamera = false) => {
    if (!(await requestPermissions())) return;

    try {
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets[0]) {
        const { success, imageUri } = await updateProfilePicture(
          result.assets[0].uri
        );
        if (success) {
          // Update the profile state correctly
          const updatedProfile = profile;
          updatedProfile.setProfileImage(imageUri);
          setProfile(updatedProfile);

          Toast.show({
            type: "success",
            text1: "Profile picture updated",
            position: "bottom",
          });
        }
      }
    } catch (error) {
      console.log("Error selecting image:", error);
      Toast.show({
        type: "error",
        text1: "Error updating profile picture",
        position: "bottom",
      });
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert("Update Profile Picture", "Choose a new profile picture", [
      {
        text: "Take Photo",
        onPress: () => handleImageSelection(true),
      },
      {
        text: "Choose from Library",
        onPress: () => handleImageSelection(false),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handlePlusButtonPress = () => {
    navigation.navigate("MainApp", { screen: "Explore" });
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
          <TouchableOpacity
            className="w-10 h-10 justify-center items-center"
            onPress={() => navigation.navigate("Settings")}
          >
            <Ionicons name="settings-outline" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View className="items-center mt-2">
          <TouchableOpacity
            onPress={showImagePickerOptions}
            className="relative"
          >
            {profile?.getProfileImage() ? (
              <Image
                source={{ uri: profile.getProfileImage() }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-orange-400 items-center justify-center">
                <Ionicons name="person" size={48} color="white" />
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
              <Ionicons name="camera" size={20} color="#FE9F1F" />
            </View>
          </TouchableOpacity>
          <Text className="text-xl font-bold mt-2">{userData.username}</Text>
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
                      {userData.currentStreak}
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
              className="bg-white rounded-xl shadow-lg mb-4 overflow-hidden border border-gray-200" // Enhanced shadow for more depth
            >
              <View className="flex-row">
                {/* Book icon styled with white circular background and shadow for better integration. Replace with collection cover in future. */}
                <View className="w-24 h-24 bg-gray-200 items-center justify-center">
                  <View className="w-16 h-16 bg-white rounded-full items-center justify-center shadow">
                    <Ionicons name="book" size={32} color="#FE9F1F" />
                  </View>
                </View>
                <View className="p-3 flex-1">
                  <Text className="font-bold text-lg">{collection.title}</Text>
                  <Text className="text-gray-500">By {collection.creator}</Text>
                </View>
              </View>
              <TouchableOpacity
                className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow items-center justify-center"
                onPress={handlePlusButtonPress}
              >
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
