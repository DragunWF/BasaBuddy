import { getData, storeData, TIMER_KEYS } from "./storageCore";
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
    const goal = await getData(TIMER_KEYS.dailyGoal);
    return goal || 20; // Default 5 minutes
  } catch (error) {
    console.error("Error getting daily goal:", error);
    return 30;
  }
};

export const setDailyGoal = async (minutes) => {
  try {
    await storeData(TIMER_KEYS.dailyGoal, minutes);
    return true;
  } catch (error) {
    console.error("Error setting daily goal:", error);
    return false;
  }
};
