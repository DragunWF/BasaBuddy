import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { storeData, getData, STORAGE_KEYS } from "./storageCore";
import { initialAchievements } from "../../constants/achievements";
import Profile from "../../models/profile";

const PROFILE_IMAGES_DIR = `${FileSystem.documentDirectory}profile_images/`;

async function ensureImageDirectoryExists() {
  const dirInfo = await FileSystem.getInfoAsync(PROFILE_IMAGES_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PROFILE_IMAGES_DIR, {
      intermediates: true,
    });
  }
}

async function saveImageToFileSystem(uri) {
  await ensureImageDirectoryExists();
  const fileName = `profile_${new Date().getTime()}.jpg`;
  const newUri = `${PROFILE_IMAGES_DIR}${fileName}`;
  await FileSystem.copyAsync({ from: uri, to: newUri });
  return newUri;
}

export async function createProfile(profile) {
  try {
    const profileData = {
      id: 1,
      firstName: profile.getFirstName(),
      lastName: profile.getLastName(),
      ageGroup: profile.getAgeGroup(),
      preferredReadingTime: profile.getPreferredReadingTime(),
      readingSpeed: profile.getReadingSpeed(),
      dailyGoal: profile.getDailyGoal() || 30, // Default to 30 if not set
      preferredCategories: [],
      profileImage: null,
      createdAt: new Date().toISOString(),
    };

    await storeData(STORAGE_KEYS.profile, profileData);
    return { success: true, insertId: 1 };
  } catch (error) {
    console.error("Error creating profile:", error);
    return { success: false, error };
  }
}

export async function updateReadingGoals(dailyGoal, categories) {
  try {
    const existingProfile = await getData(STORAGE_KEYS.profile);
    if (!existingProfile) {
      throw new Error("Profile not found");
    }

    const updatedProfile = {
      ...existingProfile,
      dailyGoal,
      preferredCategories: categories,
      updatedAt: new Date().toISOString(),
    };

    await storeData(STORAGE_KEYS.profile, updatedProfile);
    return { success: true };
  } catch (error) {
    console.error("Error updating reading goals:", error);
    return { success: false, error };
  }
}

// Update fetchProfile to include new fields
export async function fetchProfile() {
  try {
    const profileData = await getData(STORAGE_KEYS.profile);
    if (!profileData) return null;

    const profile = new Profile(
      profileData.firstName,
      profileData.lastName,
      profileData.ageGroup,
      profileData.preferredReadingTime,
      profileData.readingSpeed
    );

    if (profileData.dailyGoal) {
      profile.setDailyGoal(profileData.dailyGoal);
    }

    if (profileData.preferredCategories) {
      profile.setPreferredCategories(profileData.preferredCategories);
    }

    if (profileData.profileImage) {
      profile.setProfileImage(profileData.profileImage);
    }

    return profile;
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
        ageGroup: updatedProfile.ageGroup,
        preferredReadingTime: updatedProfile.preferredReadingTime,
        readingSpeed: updatedProfile.readingSpeed,
        dailyGoal: updatedProfile.dailyGoal,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // If using object with getter methods
      updatedData = {
        ...existingProfile,
        firstName: updatedProfile.getFirstName(),
        lastName: updatedProfile.getLastName(),
        ageGroup: updatedProfile.getAgeGroup(),
        preferredReadingTime: updatedProfile.getPreferredReadingTime(),
        readingSpeed: updatedProfile.getReadingSpeed(),
        dailyGoal: updatedProfile.getDailyGoal(),
        updatedAt: new Date().toISOString(),
      };
    }

    await storeData(STORAGE_KEYS.profile, updatedData);
    return { success: true };
  } catch (error) {
    console.log("Error updating profile:", error);
    return { success: false, error };
  }
}

export async function hasProfile() {
  try {
    const profile = await getData(STORAGE_KEYS.profile);
    return profile !== null;
  } catch (error) {
    console.log("Error checking if profile exists:", error);
    return false;
  }
}

/**
 * Reset the profile data and restore all user data to default initial values
 * This mirrors the resetStorage function but only resets user-specific data
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export async function resetProfile() {
  try {
    // Reset profile to null (user needs to go through onboarding again)
    await storeData(STORAGE_KEYS.profile, null);

    // Reset to default values (same as resetStorage function)
    await storeData(STORAGE_KEYS.booksRead, []);
    await storeData(STORAGE_KEYS.collections, [
      { id: 1, title: "Want to Read" },
      { id: 2, title: "Currently Reading" },
    ]);
    await storeData(STORAGE_KEYS.libraryBooks, []);
    await storeData(STORAGE_KEYS.savedBooks, []);
    await storeData(STORAGE_KEYS.likedBooks, []);
    await storeData(STORAGE_KEYS.achievements, initialAchievements);
    await storeData(STORAGE_KEYS.experience, 0);
    await storeData(STORAGE_KEYS.readingSessions, []);
    await storeData(STORAGE_KEYS.dailyGoal, 20); // Default 20 minutes
    await storeData(STORAGE_KEYS.messageCount, 0);

    // Reset streak data to default values
    await storeData(STORAGE_KEYS.streakData, null);
    await storeData(STORAGE_KEYS.lastReadDate, null);

    // Keep the app initialized flag as true
    await storeData(STORAGE_KEYS.initialized, true);

    return { success: true };
  } catch (error) {
    console.error("Error resetting profile:", error);
    return { success: false, error };
  }
}

/**
 * Export all user profile data to a JSON file
 * Includes profile, books, collections, achievements, reading sessions, and all user-related data
 * @returns {Promise<{success: boolean, filePath?: string, error?: any}>}
 */
export async function exportProfileData() {
  try {
    // Gather all user data from storage
    const exportData = {
      profile: await getData(STORAGE_KEYS.profile),
      booksRead: await getData(STORAGE_KEYS.booksRead),
      collections: await getData(STORAGE_KEYS.collections),
      libraryBooks: await getData(STORAGE_KEYS.libraryBooks),
      savedBooks: await getData(STORAGE_KEYS.savedBooks),
      likedBooks: await getData(STORAGE_KEYS.likedBooks),
      achievements: await getData(STORAGE_KEYS.achievements),
      experience: await getData(STORAGE_KEYS.experience),
      readingSessions: await getData(STORAGE_KEYS.readingSessions),
      dailyGoal: await getData(STORAGE_KEYS.dailyGoal),
      messageCount: await getData(STORAGE_KEYS.messageCount),
      streakData: await getData(STORAGE_KEYS.streakData),
      lastReadDate: await getData(STORAGE_KEYS.lastReadDate),
      exportedAt: new Date().toISOString(),
      appVersion: "1.0.0", // You can update this as needed
    };

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `BasaBuddy_Profile_${timestamp}.json`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    // Write JSON data to file
    await FileSystem.writeAsStringAsync(
      filePath,
      JSON.stringify(exportData, null, 2)
    );

    // Share the file using the device's sharing functionality
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "application/json",
        dialogTitle: "Export BasaBuddy Profile Data",
      });
    }

    return { success: true, filePath };
  } catch (error) {
    console.error("Error exporting profile data:", error);
    return { success: false, error };
  }
}

/**
 * Validate imported profile data structure
 * Ensures the JSON contains all required fields and proper data types
 * @param {Object} data - The imported JSON data
 * @returns {Object} - Validation result with success status and errors if any
 */
function validateImportData(data) {
  const errors = [];
  const requiredFields = [
    "profile",
    "booksRead",
    "collections",
    "libraryBooks",
    "savedBooks",
    "likedBooks",
    "achievements",
    "experience",
    "readingSessions",
  ];

  // Check if data is an object
  if (!data || typeof data !== "object") {
    return { isValid: false, errors: ["Invalid JSON format"] };
  }

  // Check required fields exist
  requiredFields.forEach((field) => {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate data types
  if (data.profile && typeof data.profile !== "object") {
    errors.push("Profile must be an object");
  }

  if (data.booksRead && !Array.isArray(data.booksRead)) {
    errors.push("booksRead must be an array");
  }

  if (data.collections && !Array.isArray(data.collections)) {
    errors.push("collections must be an array");
  }

  if (data.libraryBooks && !Array.isArray(data.libraryBooks)) {
    errors.push("libraryBooks must be an array");
  }

  if (data.savedBooks && !Array.isArray(data.savedBooks)) {
    errors.push("savedBooks must be an array");
  }

  if (data.likedBooks && !Array.isArray(data.likedBooks)) {
    errors.push("likedBooks must be an array");
  }

  if (data.achievements && !Array.isArray(data.achievements)) {
    errors.push("achievements must be an array");
  }

  if (data.readingSessions && !Array.isArray(data.readingSessions)) {
    errors.push("readingSessions must be an array");
  }

  if (data.experience !== undefined && typeof data.experience !== "number") {
    errors.push("experience must be a number");
  }

  // Validate profile structure if it exists
  if (data.profile) {
    const profileFields = [
      "firstName",
      "lastName",
      "ageGroup",
      "preferredReadingTime",
      "readingSpeed",
    ];
    profileFields.forEach((field) => {
      if (
        data.profile[field] !== undefined &&
        typeof data.profile[field] !== "string"
      ) {
        errors.push(`Profile ${field} must be a string`);
      }
    });

    if (
      data.profile.dailyGoal !== undefined &&
      typeof data.profile.dailyGoal !== "number"
    ) {
      errors.push("Profile dailyGoal must be a number");
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

/**
 * Import profile data from a JSON file
 * This will completely overwrite all existing user data
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export async function importProfileData() {
  try {
    // Open document picker to select JSON file
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) {
      return { success: false, error: "Import cancelled by user" };
    }

    // Read the file content
    const fileUri = result.assets[0].uri;
    const fileContent = await FileSystem.readAsStringAsync(fileUri);

    // Parse JSON
    let importData;
    try {
      importData = JSON.parse(fileContent);
    } catch (parseError) {
      return { success: false, error: "Invalid JSON file format" };
    }

    // Validate the imported data
    const validation = validateImportData(importData);
    if (!validation.isValid) {
      return {
        success: false,
        error: `Invalid profile data format: ${validation.errors.join(", ")}`,
      };
    }

    // Import all the data to storage
    await storeData(STORAGE_KEYS.profile, importData.profile);
    await storeData(STORAGE_KEYS.booksRead, importData.booksRead || []);
    await storeData(
      STORAGE_KEYS.collections,
      importData.collections || [
        { id: 1, title: "Want to Read" },
        { id: 2, title: "Currently Reading" },
      ]
    );
    await storeData(STORAGE_KEYS.libraryBooks, importData.libraryBooks || []);
    await storeData(STORAGE_KEYS.savedBooks, importData.savedBooks || []);
    await storeData(STORAGE_KEYS.likedBooks, importData.likedBooks || []);
    await storeData(
      STORAGE_KEYS.achievements,
      importData.achievements || initialAchievements
    );
    await storeData(STORAGE_KEYS.experience, importData.experience || 0);
    await storeData(
      STORAGE_KEYS.readingSessions,
      importData.readingSessions || []
    );
    await storeData(STORAGE_KEYS.dailyGoal, importData.dailyGoal || 20);
    await storeData(STORAGE_KEYS.messageCount, importData.messageCount || 0);
    await storeData(STORAGE_KEYS.streakData, importData.streakData || null);
    await storeData(STORAGE_KEYS.lastReadDate, importData.lastReadDate || null);

    // Keep app as initialized
    await storeData(STORAGE_KEYS.initialized, true);

    return { success: true };
  } catch (error) {
    console.error("Error importing profile data:", error);
    return {
      success: false,
      error: error.message || "Failed to import profile data",
    };
  }
}

export async function updateProfilePicture(imageUri) {
  try {
    const existingProfile = await getData(STORAGE_KEYS.profile);

    if (!existingProfile) {
      throw new Error("Profile not found");
    }

    if (existingProfile.profileImage) {
      try {
        await FileSystem.deleteAsync(existingProfile.profileImage);
      } catch (error) {
        console.log("Error deleting old profile image:", error);
      }
    }

    const savedImageUri = await saveImageToFileSystem(imageUri);

    const updatedProfile = {
      ...existingProfile,

      profileImage: savedImageUri,

      updatedAt: new Date().toISOString(),
    };

    await storeData(STORAGE_KEYS.profile, updatedProfile);

    console.log(`Profile picture was successfully updated to ${imageUri}`);

    return { success: true, imageUri: savedImageUri };
  } catch (error) {
    console.log("Error updating profile picture:", error);

    return { success: false, error };
  }
}
