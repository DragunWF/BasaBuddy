import { storeData, getData, STORAGE_KEYS } from "./storageCore";
import Achievement from "../../models/achievement";

export async function getAchievements() {
  try {
    const achievements = await getData(STORAGE_KEYS.achievements);

    if (!achievements) return [];

    return achievements.map(
      (achievement) =>
        new Achievement(
          achievement.id,
          achievement.title,
          achievement.description,
          achievement.expCount,
          achievement.completed
        )
    );
  } catch (error) {
    console.log("Error getting achievements:", error);
    return [];
  }
}

export async function completeAchievement(achievementId) {
  try {
    const achievements = await getAchievements();
    const achievementIndex = achievements.findIndex(
      (ach) => ach.getId() === achievementId
    );

    if (achievementIndex === -1) {
      throw new Error("Achievement not found");
    }

    achievements[achievementIndex].completed = true;

    await storeData(STORAGE_KEYS.achievements, achievements);
    return { success: true };
  } catch (error) {
    console.log("Error completing achievement:", error);
    return { success: false, error };
  }
}
