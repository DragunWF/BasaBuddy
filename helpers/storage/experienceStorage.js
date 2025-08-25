import { storeData, getData, STORAGE_KEYS } from "./storageCore";
import { levelTitles } from "../../constants/levelTitles";

export async function addExperience(points) {
  try {
    const currentExp = (await getData(STORAGE_KEYS.experience)) || 0;
    const newExp = currentExp + points;
    await storeData(STORAGE_KEYS.experience, newExp);
    return { success: true, experience: newExp };
  } catch (error) {
    console.log("Error adding experience:", error);
    return { success: false, error };
  }
}

export async function getExperience() {
  try {
    return (await getData(STORAGE_KEYS.experience)) || 0;
  } catch (error) {
    console.log("Error getting experience:", error);
    return 0;
  }
}

export async function getLevel() {
  try {
    const experience = await getExperience();
    // Simple level calculation: every 100 points = 1 level
    return Math.floor(experience / 100);
  } catch (error) {
    console.log("Error calculating level:", error);
    return 1;
  }
}

export async function getLevelTitle() {
  try {
    const level = await getLevel();
    const maxLevel = Math.max(...Object.keys(levelTitles).map(Number));
    if (level > maxLevel) {
      return levelTitles[maxLevel].title;
    }
    return levelTitles[level].title || "Novice Reader";
  } catch (error) {
    console.log("Error getting level title:", error);
    return "Novice Reader";
  }
}
