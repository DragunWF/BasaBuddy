import * as FileSystem from "expo-file-system";
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
