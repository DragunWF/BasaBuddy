import { storeData, getData, STORAGE_KEYS } from "./storageCore";
import { checkAndUnlockAchievements } from "../tools/achievementCog";
import { ACHIEVEMENT_TRIGGERS } from "../../constants/achievements";
import Collection from "../../models/collection";

export async function getCollections() {
  try {
    const collections = await getData(STORAGE_KEYS.collections);

    if (!collections) return [];

    return collections.map(
      (collection) => new Collection(collection.id, collection.title)
    );
  } catch (error) {
    console.log("Error getting collections:", error);
    return [];
  }
}

export async function deleteCollection(collectionId) {
  try {
    let collections = (await getData(STORAGE_KEYS.collections)) || [];
    collections = collections.filter(
      (collection) => collection.id !== collectionId
    );
    await storeData(STORAGE_KEYS.collections, collections);
    return { success: true };
  } catch (error) {
    console.log("Error removing collection:", error);
    return { success: false, error };
  }
}

export async function updateCollection(collectionId, newTitle) {
  try {
    const collections = (await getData(STORAGE_KEYS.collections)) || [];
    const collectionIndex = collections.findIndex(
      (collection) => collection.id === collectionId
    );
    collections[collectionIndex].title = newTitle;
    await storeData(STORAGE_KEYS.collections, collections);
    if (collectionIndex === -1) {
      return { success: false, error: "Collection not found" };
    }
    return { success: true, collection: collections[collectionIndex] };
  } catch (error) {
    console.log("Error updating collection:", error);
    return { success: false, error };
  }
}

export async function createCollection(title) {
  try {
    const collections = (await getData(STORAGE_KEYS.collections)) || [];
    const newCollection = {
      id: Math.random() + Date.now(),
      title: title,
      createdAt: new Date().toISOString(),
    };

    collections.push(newCollection);
    await storeData(STORAGE_KEYS.collections, collections);
    await checkAndUnlockAchievements(
      ACHIEVEMENT_TRIGGERS.COLLECTIONS_COUNT,
      collections.length
    );
    return {
      success: true,
      collection: new Collection(newCollection.id, newCollection.title),
    };
  } catch (error) {
    console.log("Error creating collection:", error);
    return { success: false, error };
  }
}

export async function getCollectionBookCount(collectionId) {
  try {
    const savedBooks = (await getData(STORAGE_KEYS.savedBooks)) || [];
    return savedBooks.filter((book) => book.collectionId === collectionId)
      .length;
  } catch (error) {
    console.log("Error getting collection book count:", error);
    return 0;
  }
}
