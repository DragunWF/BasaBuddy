import {
  storeData,
  getData,
  STORAGE_KEYS,
  STREAK_KEYS,
} from "../helpers/storage/storageCore";
import Toast from "react-native-toast-message";

/**
 * ===== DEMO DATA UTILITIES =====
 *
 * This file provides demo functionality for BasaBuddy app.
 * Creates an initial 6-day reading streak for September 2025 to demonstrate
 * the app's streak tracking and progress features.
 *
 * This is purely for demo purposes and should not be used in production.
 * ===============================
 */

/**
 * Initialize a 7-day reading streak ending today (September 14, 2025)
 *
 * Creates:
 * - Reading streak of 7 consecutive days (Sept 8-14, 2025)
 * - Reading sessions for each day (30-45 minutes per day)
 * - Daily goal achievement for streak calculation
 * - Last read date set to today (Sept 14, 2025)
 *
 * @returns {Promise<boolean>} Success status of initialization
 */
export async function initializeDemoReadingStreak() {
  try {
    // Define the 7-day streak period ending today (September 8-14, 2025)
    const today = new Date("2025-09-14");
    const streakDays = 7;
    const streakStartDate = new Date(today);
    streakStartDate.setDate(today.getDate() - (streakDays - 1)); // Go back 6 days to get 7 total
    const streakEndDate = today;

    // Create reading sessions for each day of the streak
    const readingSessions = [];
    for (let i = 0; i < streakDays; i++) {
      const sessionDate = new Date(streakStartDate);
      sessionDate.setDate(sessionDate.getDate() + i);

      // Create 1-2 reading sessions per day with varying durations
      const sessionsPerDay = Math.random() > 0.5 ? 2 : 1;
      let dailyMinutes = 0;

      for (let j = 0; j < sessionsPerDay; j++) {
        // Random reading duration between 15-30 minutes per session
        const sessionMinutes = Math.floor(Math.random() * 16) + 15; // 15-30 minutes
        dailyMinutes += sessionMinutes;

        readingSessions.push({
          id: `demo_${i}_${j}`,
          date: sessionDate.toISOString(),
          minutes: sessionMinutes,
          bookTitle: "Demo Reading Session",
          category: "Fiction",
          createdAt: sessionDate.toISOString(),
        });
      }

      // Ensure each day meets the minimum daily goal (20 minutes)
      if (dailyMinutes < 20) {
        readingSessions[readingSessions.length - 1].minutes +=
          20 - dailyMinutes;
      }
    }

    // Store the streak data
    const streakData = {
      currentStreak: streakDays,
      longestStreak: streakDays,
      totalDays: streakDays,
      startDate: streakStartDate.toISOString(),
    };

    // Store all demo data to AsyncStorage
    await storeData(STREAK_KEYS.streakData, streakData);
    await storeData(
      STREAK_KEYS.lastReadDate,
      streakEndDate.toISOString().split("T")[0]
    );
    await storeData(STORAGE_KEYS.readingSessions, readingSessions);

    // Set daily goal to 20 minutes (default)
    await storeData(STORAGE_KEYS.dailyGoal, 20);

    // Show success notification
    Toast.show({
      type: "success",
      text1: "Demo Streak Initialized!",
      text2: `7-day reading streak created (Sept 8-14, 2025)`,
      visibilityTime: 3000,
    });

    console.log(`Demo reading streak initialized: ${streakDays} days`);
    console.log(
      `Streak period: ${streakStartDate.toDateString()} - ${streakEndDate.toDateString()}`
    );
    console.log(`Total reading sessions created: ${readingSessions.length}`);

    return true;
  } catch (error) {
    console.error("Error initializing demo reading streak:", error);

    Toast.show({
      type: "error",
      text1: "Demo Initialization Failed",
      text2: "Could not create demo reading streak",
      visibilityTime: 4000,
    });

    return false;
  }
}

/**
 * Clear demo reading streak data
 *
 * Removes all demo-related reading data and resets streak to 0.
 * Useful for testing or resetting demo state.
 *
 * @returns {Promise<boolean>} Success status of cleanup
 */
export async function clearDemoReadingStreak() {
  try {
    // Reset streak data
    await storeData(STREAK_KEYS.streakData, {
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
    });

    await storeData(STREAK_KEYS.lastReadDate, null);

    // Clear demo reading sessions (keep non-demo sessions if any)
    const allSessions = (await getData(STORAGE_KEYS.readingSessions)) || [];
    const nonDemoSessions = allSessions.filter(
      (session) => !session.id || !session.id.startsWith("demo_")
    );

    await storeData(STORAGE_KEYS.readingSessions, nonDemoSessions);

    Toast.show({
      type: "info",
      text1: "Demo Data Cleared",
      text2: "Reading streak reset to 0",
      visibilityTime: 3000,
    });

    return true;
  } catch (error) {
    console.error("Error clearing demo reading streak:", error);
    return false;
  }
}

// Export the main function as default
export default initializeDemoReadingStreak;
