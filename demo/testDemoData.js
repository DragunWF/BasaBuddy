// Test file for demo data utils
import { generateInitialReadingStreak } from "./demoDataUtils";
import { getData, STREAK_KEYS } from "../helpers/storage/storageCore";

export const testDemoStreak = async () => {
  try {
    console.log("Testing generateInitialReadingStreak function...");

    // Generate the initial streak
    await generateInitialReadingStreak();

    // Verify the streak data was stored correctly
    const streakData = await getData(STREAK_KEYS.STREAK_DATA);
    const streakCount = await getData(STREAK_KEYS.CURRENT_STREAK);
    const lastReadDate = await getData(STREAK_KEYS.LAST_READ_DATE);

    console.log("Streak Data:", streakData);
    console.log("Current Streak Count:", streakCount);
    console.log("Last Read Date:", lastReadDate);

    // Verify we have 6 days of streak data for September 2025
    if (streakData && Array.isArray(streakData)) {
      console.log(`Generated ${streakData.length} streak entries`);

      // Check dates are in September 2025
      const septemberDates = streakData.filter((entry) => {
        const date = new Date(entry.date);
        return date.getFullYear() === 2025 && date.getMonth() === 8; // September is month 8
      });

      console.log(`Found ${septemberDates.length} September 2025 entries`);

      if (septemberDates.length === 6) {
        console.log(
          "✅ Demo streak test PASSED - 6 September 2025 entries created"
        );
        return true;
      } else {
        console.log(
          "❌ Demo streak test FAILED - Expected 6 entries, got",
          septemberDates.length
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
