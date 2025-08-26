import { storeData, getData, STORAGE_KEYS } from "./storageCore";
import Profile from "../../models/profile";

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
    console.log("Error creating profile:", error);
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
