import AsyncStorage from "@react-native-async-storage/async-storage";
import Profile from "../../models/profile";
import Collection from "../../models/collection";

// Storage keys
const STORAGE_KEYS = {
  profile: "basabuddy_profile",
  booksRead: "basabuddy_booksRead",
  collections: "basabuddy_collections",
  savedBooks: "basabuddy_savedBooks",
  initialized: "basabuddy_initialized",
};

// Helper function to get data from AsyncStorage
const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    return null;
  }
};

// Helper function to store data in AsyncStorage
const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
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
        { id: 3, title: "Read Books" },
      ];

      await storeData(STORAGE_KEYS.collections, defaultCollections);
      await storeData(STORAGE_KEYS.booksRead, []);
      await storeData(STORAGE_KEYS.savedBooks, []);
      await storeData(STORAGE_KEYS.initialized, true);

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
export async function resetDatabase() {
  try {
    // Clear all stored data
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
    console.error("Error resetting AsyncStorage:", error);
  }
}

export async function createProfile(profile) {
  try {
    // Convert profile to plain object for storage
    const profileData = {
      id: 1, // Since we only store one profile
      firstName: profile.getFirstName(),
      lastName: profile.getLastName(),
      favoriteGenre: profile.getFavoriteGenre(),
      preferredReadingTime: profile.getPreferredReadingTime(),
      readingSpeed: profile.getReadingSpeed(),
      createdAt: new Date().toISOString(),
    };

    await storeData(STORAGE_KEYS.profile, profileData);
    return { success: true, insertId: 1 };
  } catch (error) {
    console.error("Error creating profile:", error);
    return { success: false, error };
  }
}

export async function fetchProfile() {
  try {
    const profileData = await getData(STORAGE_KEYS.profile);

    if (!profileData) return null;

    return new Profile(
      profileData.firstName,
      profileData.lastName,
      profileData.favoriteGenre,
      profileData.preferredReadingTime,
      profileData.readingSpeed
    );
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function updateProfile(id, updatedProfile) {
  try {
    const existingProfile = await getData(STORAGE_KEYS.profile);

    if (!existingProfile) {
      throw new Error("Profile not found");
    }

    let updatedData;

    // If using object with properties
    if (typeof updatedProfile === "object" && !updatedProfile.getFirstName) {
      updatedData = {
        ...existingProfile,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        favoriteGenre: updatedProfile.favoriteGenre,
        preferredReadingTime: updatedProfile.preferredReadingTime,
        readingSpeed: updatedProfile.readingSpeed,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // If using object with getter methods
      updatedData = {
        ...existingProfile,
        firstName: updatedProfile.getFirstName(),
        lastName: updatedProfile.getLastName(),
        favoriteGenre: updatedProfile.getFavoriteGenre(),
        preferredReadingTime: updatedProfile.getPreferredReadingTime(),
        readingSpeed: updatedProfile.getReadingSpeed(),
        updatedAt: new Date().toISOString(),
      };
    }

    await storeData(STORAGE_KEYS.profile, updatedData);
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error };
  }
}

export async function hasProfile() {
  try {
    const profile = await getData(STORAGE_KEYS.profile);
    return profile !== null;
  } catch (error) {
    console.error("Error checking if profile exists:", error);
    return false;
  }
}

export async function getCollections() {
  try {
    const collections = await getData(STORAGE_KEYS.collections);

    if (!collections) return [];

    return collections.map(
      (collection) => new Collection(collection.id, collection.title)
    );
  } catch (error) {
    console.error("Error getting collections:", error);
    return [];
  }
}

// Add a book to booksRead
export async function addBookToRead(book) {
  try {
    const booksRead = (await getData(STORAGE_KEYS.booksRead)) || [];
    const newBook = {
      id: Date.now(), // Simple ID generation
      title: book.title,
      author: book.author,
      description: book.description,
      addedAt: new Date().toISOString(),
    };

    booksRead.push(newBook);
    await storeData(STORAGE_KEYS.booksRead, booksRead);
    return { success: true, book: newBook };
  } catch (error) {
    console.error("Error adding book to read:", error);
    return { success: false, error };
  }
}

export async function getBooksRead() {
  try {
    return (await getData(STORAGE_KEYS.booksRead)) || [];
  } catch (error) {
    console.error("Error getting books read:", error);
    return [];
  }
}

export async function addBookToCollection(bookId, collectionId) {
  try {
    const savedBooks = (await getData(STORAGE_KEYS.savedBooks)) || [];
    const newSavedBook = {
      id: Date.now(),
      bookId: bookId,
      collectionId: collectionId,
      addedAt: new Date().toISOString(),
    };

    savedBooks.push(newSavedBook);
    await storeData(STORAGE_KEYS.savedBooks, savedBooks);
    return { success: true, savedBook: newSavedBook };
  } catch (error) {
    console.error("Error adding book to collection:", error);
    return { success: false, error };
  }
}

export async function getBooksInCollection(collectionId) {
  try {
    const savedBooks = (await getData(STORAGE_KEYS.savedBooks)) || [];
    return savedBooks.filter((book) => book.collectionId === collectionId);
  } catch (error) {
    console.error("Error getting books in collection:", error);
    return [];
  }
}

export async function createCollection(title) {
  try {
    const collections = (await getData(STORAGE_KEYS.collections)) || [];
    const newCollection = {
      id: Date.now(),
      title: title,
      createdAt: new Date().toISOString(),
    };

    collections.push(newCollection);
    await storeData(STORAGE_KEYS.collections, collections);
    return { success: true, collection: newCollection };
  } catch (error) {
    console.error("Error creating collection:", error);
    return { success: false, error };
  }
}
