import { storeData, getData, STORAGE_KEYS } from "./storageCore";
import { getLikedBooks, getLibraryBooks } from "./bookStorage";
import { getCollections } from "./collectionStorage";
import { ACHIEVEMENT_TRIGGERS } from "../../constants/achievements";
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
          achievement.trigger,
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

export async function tryUnlockAchievements() {
  try {
    const unlockedAchievements = [];

    const achievements = await getAchievements();
    const likedBooks = await getLikedBooks();
    const libraryBooks = await getLibraryBooks();
    const collections = await getCollections();

    const achievementsObjList = achievements.map((item) => {
      return {
        id: item.getId(),
        title: item.getTitle(),
        description: item.getDescription(),
        expCount: item.getExpCount(),
        completed: item.getCompleted(),
        trigger: item.getRequiredTrigger(),
      };
    });

    const updatedAchievements = achievementsObjList.map((achievement) => {
      if (achievement.completed) {
        return achievement; // Already completed
      }

      const requiredTrigger = achievement.trigger;
      switch (requiredTrigger.type) {
        case ACHIEVEMENT_TRIGGERS.LIKED_BOOKS_COUNT:
          if (likedBooks.length >= requiredTrigger.count) {
            achievement.completed = true;
            unlockedAchievements.push(achievement);
          }
          break;
        case ACHIEVEMENT_TRIGGERS.FINISHED_BOOKS_COUNT:
          if (libraryBooks.length >= requiredTrigger.count) {
            achievement.completed = true;
            unlockedAchievements.push(achievement);
          }
          break;
        case ACHIEVEMENT_TRIGGERS.COLLECTIONS_COUNT:
          if (collections.length >= requiredTrigger.count) {
            achievement.completed = true;
            unlockedAchievements.push(achievement);
          }
          break;
        default:
          break;
      }

      return achievement;
    });

    await storeData(STORAGE_KEYS.achievements, updatedAchievements);
    return { success: true, unlockedAchievements };
  } catch (error) {
    console.log("Error trying to unlock achievements:", error);
    return { success: false, error };
  }
}
