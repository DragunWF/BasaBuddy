import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialAchievements } from "../../constants/achievements";

export const STREAK_KEYS = {
  streakData: "basabuddy_streakData",
  lastReadDate: "basabuddy_lastReadDate",
};

export const TIMER_KEYS = {
  readingSessions: "basabuddy_readingSessions",
  dailyGoal: "basabuddy_dailyGoal",
};

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
  readingSessions: "basabuddy_readingSessions",
  dailyGoal: "basabuddy_dailyGoal",
  messageCount: "basabuddy_messageCount",
  ...STREAK_KEYS,
  ...TIMER_KEYS,
};

// Default values
const DEFAULT_VALUES = {
  profile: null,
  booksRead: [],
  collections: [
    { id: 1, title: "Want to Read" },
    { id: 2, title: "Currently Reading" },
  ],
  libraryBooks: [],
  savedBooks: [],
  likedBooks: [],
  initialized: true,
  achievements: initialAchievements,
  experience: 0,
  readingSessions: [],
  dailyGoal: 1,
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
      // Initialize all storage keys with default values
      for (const [key, defaultValue] of Object.entries(DEFAULT_VALUES)) {
        await storeData(STORAGE_KEYS[key], defaultValue);
      }

      console.log("AsyncStorage initialized with default data");
    }
  } catch (error) {
    console.error("Error initializing AsyncStorage:", error);
  }
}

/*
  This is primarily used for testing and debugging.
  Do not use this for production.
*/
export async function resetStorage() {
  try {
    // Clear all stored data
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));

    // Reset each key with its default value
    for (const [key, defaultValue] of Object.entries(DEFAULT_VALUES)) {
      await storeData(STORAGE_KEYS[key], defaultValue);
    }

    console.info("AsyncStorage has been reset to default values!");
    return true;
  } catch (error) {
    console.error("Error resetting AsyncStorage:", error);
    return false;
  }
}
