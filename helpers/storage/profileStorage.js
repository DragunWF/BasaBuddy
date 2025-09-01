import * as FileSystem from "expo-file-system";
import { storeData, getData, STORAGE_KEYS } from "./storageCore";
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
      favoriteGenre: profile.getFavoriteGenre(),
      preferredReadingTime: profile.getPreferredReadingTime(),
      readingSpeed: profile.getReadingSpeed(),
      profileImage: null, // Add this field
      createdAt: new Date().toISOString(),
    };

    await storeData(STORAGE_KEYS.profile, profileData);
    return { success: true, insertId: 1 };
  } catch (error) {
    console.log("Error creating profile:", error);
    return { success: false, error };
  }
}

export async function updateProfilePicture(imageUri) {
  try {
    const existingProfile = await getData(STORAGE_KEYS.profile);
    if (!existingProfile) {
      throw new Error("Profile not found");
    }

    // If there's an existing profile image, delete it
    if (existingProfile.profileImage) {
      try {
        await FileSystem.deleteAsync(existingProfile.profileImage);
      } catch (error) {
        console.log("Error deleting old profile image:", error);
      }
    }

    // Save the new image
    const savedImageUri = await saveImageToFileSystem(imageUri);

    const updatedProfile = {
      ...existingProfile,
      profileImage: savedImageUri,
      updatedAt: new Date().toISOString(),
    };

    await storeData(STORAGE_KEYS.profile, updatedProfile);
    return { success: true, imageUri: savedImageUri };
  } catch (error) {
    console.log("Error updating profile picture:", error);
    return { success: false, error };
  }
}

export async function fetchProfile() {
  try {
    const profileData = await getData(STORAGE_KEYS.profile);

    if (!profileData) return null;

    const profile = new Profile(
      profileData.firstName,
      profileData.lastName,
      profileData.favoriteGenre,
      profileData.preferredReadingTime,
      profileData.readingSpeed
    );

    profile.profileImage = profileData.profileImage;

    return profile;
  } catch (error) {
    console.log("Error fetching profile:", error);
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
