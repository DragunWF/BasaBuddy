import Toast from "react-native-toast-message";
import { tryUnlockAchievements } from "../storage/achievementStorage";

export async function checkAndUnlockAchievements(trigger, value) {
  try {
    const result = await tryUnlockAchievements(trigger, value);
    if (result.success && result.unlockedAchievements.length > 0) {
      // Show collection creation toast first
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait 1.5s

      // Then show achievement toasts sequentially
      for (let [index, achievement] of result.unlockedAchievements.entries()) {
        setTimeout(() => {
          Toast.show({
            type: "success",
            text1: `🏆 Achievement Unlocked: ${achievement.title}`,
            text2: achievement.description,
            visibilityTime: 3000,
          });
        }, index * 1500); // Show each achievement toast 1.5s after the previous one
      }
    }
    console.log("Unlocked achievements:", result.unlockedAchievements);
  } catch (error) {
    console.error("Error checking/unlocking achievements:", error);
    Toast.show({
      type: "error",
      text1: "Error unlocking achievements",
      text2: "An error occurred while unlocking achievements.",
      position: "bottom",
    });
  }
}
