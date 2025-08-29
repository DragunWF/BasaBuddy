import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialAchievements } from "../../constants/achievements";

// Storage keys
export const STORAGE_KEYS = {
  profile: "basabuddy_profile",
  booksRead: "basabuddy_booksRead",
  collections: "basabuddy_collections",
  libraryBooks: "basabuddy_library",
  savedBooks: "basabuddy_savedBooks",
  likedBooks: "basabuddy_likedBooks",
  initialized: "basabuddy_initialized",
  achievements: "basabuddy_achievements",
  experience: "basabuddy_experience",
};

// Helper function to get data from AsyncStorage
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log(`Error getting data for key ${key}:`, error);
    return null;
  }
};

// Helper function to store data in AsyncStorage
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log(`Error storing data for key ${key}:`, error);
  }
};

export async function init() {
  try {
    // Check if already initialized
    const isInitialized = await getData(STORAGE_KEYS.initialized);

    if (!isInitialized) {
      // Initialize default collections
      const defaultCollections = [
        { id: 1, title: "Want to Read" },
        { id: 2, title: "Currently Reading" },
      ];

      await storeData(STORAGE_KEYS.collections, defaultCollections);
      await storeData(STORAGE_KEYS.achievements, initialAchievements);
      await storeData(STORAGE_KEYS.booksRead, []);
      await storeData(STORAGE_KEYS.savedBooks, []);
      await storeData(STORAGE_KEYS.initialized, true);

      console.log("AsyncStorage initialized with default data");
    }
  } catch (error) {
    console.log("Error initializing AsyncStorage:", error);
  }
}

/*
  This is primarily used for testing and debugging.
  Do not use this for production.
*/
export async function resetStorage() {
  try {
    // Clear all stored data
    const allKeys = [];
    for (let key in STORAGE_KEYS) {
      allKeys.push(key);
    }
    // await AsyncStorage.multiRemove(allKeys);
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.profile,
      STORAGE_KEYS.booksRead,
      STORAGE_KEYS.collections,
      STORAGE_KEYS.savedBooks,
      STORAGE_KEYS.initialized,
    ]);

    // Re-initialize
    await init();
    console.info("AsyncStorage has been reset!");
  } catch (error) {
    console.log("Error resetting AsyncStorage:", error);
  }
}
