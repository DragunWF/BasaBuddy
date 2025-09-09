import { getData, storeData, TIMER_KEYS, STORAGE_KEYS } from "./storageCore";
import { updateStreak } from "./streakStorage";

// Save a completed reading session
export const saveReadingSession = async (minutes) => {
  try {
    const sessions = (await getData(TIMER_KEYS.readingSessions)) || [];
    const newSession = {
      date: new Date().toISOString(),
      minutes: minutes,
    };

    sessions.push(newSession);
    await storeData(TIMER_KEYS.readingSessions, sessions);

    // Update streak after saving session
    await updateStreak();
    return true;
  } catch (error) {
    console.error("Error saving reading session:", error);
    return false;
  }
};

// Get total reading time for today
export const getTodayReadingTime = async () => {
  try {
    const sessions = (await getData(TIMER_KEYS.readingSessions)) || [];
    const today = new Date().toDateString();

    return sessions
      .filter((session) => new Date(session.date).toDateString() === today)
      .reduce((total, session) => total + session.minutes, 0);
  } catch (error) {
    console.error("Error getting today reading time:", error);
    return 0;
  }
};

// Get/Set daily reading goal
export const getDailyGoal = async () => {
  try {
    // First try to get from profile storage (new way)
    const profile = await getData(STORAGE_KEYS.profile);
    if (profile && profile.dailyGoal) {
      return profile.dailyGoal;
    }
    
    // Fallback to timer storage for backward compatibility
    const goal = await getData(TIMER_KEYS.dailyGoal);
    return goal || 30; // Default 30 minutes
  } catch (error) {
    console.error("Error getting daily goal:", error);
    return 30;
  }
};

export const setDailyGoal = async (minutes) => {
  try {
    // Update both profile storage (primary) and timer storage (fallback)
    const profile = await getData(STORAGE_KEYS.profile);
    if (profile) {
      const updatedProfile = {
        ...profile,
        dailyGoal: minutes,
        updatedAt: new Date().toISOString(),
      };
      await storeData(STORAGE_KEYS.profile, updatedProfile);
    }
    
    // Also update timer storage for backward compatibility
    await storeData(TIMER_KEYS.dailyGoal, minutes);
    return true;
  } catch (error) {
    console.error("Error setting daily goal:", error);
    return false;
  }
};
