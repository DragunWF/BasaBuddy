import { getData, storeData, STREAK_KEYS } from "./storageCore";
import { getTodayReadingTime, getDailyGoal } from "./timerStorage";

// Get current streak
export const getCurrentStreak = async () => {
  try {
    const streakData = (await getData(STREAK_KEYS.streakData)) || {
      currentStreak: 0,
    };
    const lastReadDate = await getData(STREAK_KEYS.lastReadDate);

    // Check if streak is broken (more than 1 day gap)
    if (lastReadDate) {
      const lastRead = new Date(lastReadDate);
      const today = new Date();
      const dayDiff = Math.floor((today - lastRead) / (1000 * 60 * 60 * 24));

      if (dayDiff > 1) {
        // Streak broken, reset to 0
        await storeData(STREAK_KEYS.streakData, { currentStreak: 0 });
        return 0;
      }
    }

    return streakData.currentStreak;
  } catch (error) {
    console.error("Error getting current streak:", error);
    return 0;
  }
};

// Update streak based on daily goal completion
export const updateStreak = async () => {
  try {
    const todayReadingTime = await getTodayReadingTime();
    const dailyGoal = await getDailyGoal();
    const goalAchieved = todayReadingTime >= dailyGoal;

    if (!goalAchieved) return;

    const currentDate = new Date().toISOString().split("T")[0];
    const lastReadDate = await getData(STREAK_KEYS.lastReadDate);
    const streakData = (await getData(STREAK_KEYS.streakData)) || {
      currentStreak: 0,
    };

    if (!lastReadDate) {
      // First time reading
      await storeData(STREAK_KEYS.streakData, { currentStreak: 1 });
      await storeData(STREAK_KEYS.lastReadDate, currentDate);
      return 1;
    }

    if (lastReadDate === currentDate) {
      // Already updated today
      return streakData.currentStreak;
    }

    const lastRead = new Date(lastReadDate);
    const today = new Date(currentDate);
    const dayDiff = Math.floor((today - lastRead) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      // Consecutive day, increase streak
      const newStreak = streakData.currentStreak + 1;
      await storeData(STREAK_KEYS.streakData, { currentStreak: newStreak });
      await storeData(STREAK_KEYS.lastReadDate, currentDate);
      return newStreak;
    } else if (dayDiff > 1) {
      // Streak broken, start new streak
      await storeData(STREAK_KEYS.streakData, { currentStreak: 1 });
      await storeData(STREAK_KEYS.lastReadDate, currentDate);
      return 1;
    }

    return streakData.currentStreak;
  } catch (error) {
    console.error("Error updating streak:", error);
    return 0;
  }
};

// Get completed reading days in a month
export const getMonthlyReadingDays = async (year, month) => {
  try {
    const sessions = (await getData("basabuddy_readingSessions")) || [];
    const dailyGoal = await getDailyGoal();

    // Group sessions by date
    const dailyTotals = sessions.reduce((acc, session) => {
      const date = new Date(session.date);
      if (date.getFullYear() === year && date.getMonth() === month) {
        const dateStr = date.toISOString().split("T")[0];
        acc[dateStr] = (acc[dateStr] || 0) + session.minutes;
      }
      return acc;
    }, {});

    const completedDates = [];
    const partialDates = [];

    // Sort days into completed and partial
    Object.entries(dailyTotals).forEach(([date, minutes]) => {
      if (minutes >= dailyGoal) {
        completedDates.push(date);
      } else if (minutes > 0) {
        partialDates.push(date);
      }
    });

    return { completedDates, partialDates };
  } catch (error) {
    console.error("Error getting monthly reading days:", error);
    return { completedDates: [], partialDates: [] };
  }
};
