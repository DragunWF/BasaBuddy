import AsyncStorage from "@react-native-async-storage/async-storage";
import { getData, storeData } from "./storageCore";

// Add these keys to storageCore.js STORAGE_KEYS
const TIMER_KEYS = {
  readingSessions: "basabuddy_readingSessions",
  dailyGoal: "basabuddy_dailyGoal",
};

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
    return goal || 30; // Default 30 minutes
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
