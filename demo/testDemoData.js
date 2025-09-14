// Test file for demo data utils
import { initializeDemoReadingStreak } from "./demoDataUtils";
import { getData, STREAK_KEYS } from "../helpers/storage/storageCore";

export const testDemoStreak = async () => {
  try {
    console.log("Testing initializeDemoReadingStreak function...");

    // Generate the initial streak
    await initializeDemoReadingStreak();

    // Verify the streak data was stored correctly
    const streakData = await getData(STREAK_KEYS.streakData);
    const lastReadDate = await getData(STREAK_KEYS.lastReadDate);

    console.log("Streak Data:", streakData);
    console.log("Last Read Date:", lastReadDate);

    // Verify we have 7 days of streak data ending today
    if (streakData) {
      console.log(`Current streak: ${streakData.currentStreak} days`);
      console.log(`Total days: ${streakData.totalDays} days`);

      if (streakData.currentStreak === 7 && streakData.totalDays === 7) {
        console.log(
          "✅ Demo streak test PASSED - 7-day streak created successfully"
        );
        return true;
      } else {
        console.log(
          "❌ Demo streak test FAILED - Expected 7-day streak, got",
          streakData.currentStreak
        );
        return false;
      }
    } else {
      console.log("❌ Demo streak test FAILED - No streak data found");
      return false;
    }
  } catch (error) {
    console.error("Error testing demo streak:", error);
    return false;
  }
};
