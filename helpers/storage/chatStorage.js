import { getData, storeData, STORAGE_KEYS } from "./storageCore";
import { checkAndUnlockAchievements } from "../tools/achievementCog";
import { ACHIEVEMENT_TRIGGERS } from "../../constants/achievements";

export async function incrementMessageCount() {
  try {
    const messageCount = (await getData(STORAGE_KEYS.messageCount)) || 0;
    await checkAndUnlockAchievements(
      ACHIEVEMENT_TRIGGERS.CHAT_MESSAGES_COUNT,
      messageCount + 1
    );
    await storeData(STORAGE_KEYS.messageCount, messageCount + 1);
  } catch (error) {
    console.log("Error incrementing message count:", error);
  }
}

export async function getMessageCount() {
  try {
    return (await getData(STORAGE_KEYS.messageCount)) || 0;
  } catch (error) {
    console.log("Error getting message count:", error);
    return 0;
  }
}
