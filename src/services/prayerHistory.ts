// Prayer History Service for tracking prayer completion over time

export interface PrayerHistoryEntry {
  date: string; // YYYY-MM-DD format
  prayers: {
    Fajr: boolean;
    Dhuhr: boolean;
    Asr: boolean;
    Maghrib: boolean;
    Isha: boolean;
  };
  completionPercentage: number;
}

export interface PrayerStats {
  currentStreak: number;
  longestStreak: number;
  totalPrayers: number;
  totalMissed: number;
  monthlyStats: {
    [month: string]: {
      completed: number;
      total: number;
      percentage: number;
    };
  };
}

const STORAGE_KEY = 'prayerHistory';
const STATS_KEY = 'prayerStats';

/**
 * Get prayer history from localStorage
 */
export const getPrayerHistory = (): PrayerHistoryEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading prayer history:', error);
    return [];
  }
};

/**
 * Save prayer entry for a specific date
 */
export const savePrayerEntry = (
  date: string,
  prayers: { Fajr: boolean; Dhuhr: boolean; Asr: boolean; Maghrib: boolean; Isha: boolean }
): void => {
  try {
    const history = getPrayerHistory();
    const existingIndex = history.findIndex((entry) => entry.date === date);

    const completionPercentage = (Object.values(prayers).filter(Boolean).length / 5) * 100;

    const newEntry: PrayerHistoryEntry = {
      date,
      prayers,
      completionPercentage,
    };

    if (existingIndex >= 0) {
      history[existingIndex] = newEntry;
    } else {
      history.push(newEntry);
    }

    // Sort by date (newest first)
    history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Keep only last 90 days
    const trimmedHistory = history.slice(0, 90);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));

    // Update stats
    updateStats(trimmedHistory);
  } catch (error) {
    console.error('Error saving prayer entry:', error);
  }
};

/**
 * Get prayer entry for a specific date
 */
export const getPrayerEntryByDate = (date: string): PrayerHistoryEntry | null => {
  const history = getPrayerHistory();
  return history.find((entry) => entry.date === date) || null;
};

/**
 * Calculate current streak
 */
const calculateCurrentStreak = (history: PrayerHistoryEntry[]): number => {
  if (history.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < history.length; i++) {
    const entryDate = new Date(history[i].date);
    entryDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    if (entryDate.getTime() !== expectedDate.getTime()) {
      break;
    }

    if (history[i].completionPercentage === 100) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Calculate longest streak
 */
const calculateLongestStreak = (history: PrayerHistoryEntry[]): number => {
  if (history.length === 0) return 0;

  let maxStreak = 0;
  let currentStreak = 0;

  // Sort by date ascending for streak calculation
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (let i = 0; i < sortedHistory.length; i++) {
    if (sortedHistory[i].completionPercentage === 100) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
};

/**
 * Update prayer statistics
 */
const updateStats = (history: PrayerHistoryEntry[]): void => {
  try {
    const currentStreak = calculateCurrentStreak(history);
    const longestStreak = calculateLongestStreak(history);

    let totalPrayers = 0;
    let totalMissed = 0;
    const monthlyStats: { [month: string]: { completed: number; total: number; percentage: number } } = {};

    history.forEach((entry) => {
      const completed = Object.values(entry.prayers).filter(Boolean).length;
      const missed = 5 - completed;

      totalPrayers += completed;
      totalMissed += missed;

      // Extract month (YYYY-MM format)
      const month = entry.date.substring(0, 7);

      if (!monthlyStats[month]) {
        monthlyStats[month] = { completed: 0, total: 0, percentage: 0 };
      }

      monthlyStats[month].completed += completed;
      monthlyStats[month].total += 5;
    });

    // Calculate percentages
    Object.keys(monthlyStats).forEach((month) => {
      const stats = monthlyStats[month];
      stats.percentage = (stats.completed / stats.total) * 100;
    });

    const stats: PrayerStats = {
      currentStreak,
      longestStreak,
      totalPrayers,
      totalMissed,
      monthlyStats,
    };

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating stats:', error);
  }
};

/**
 * Get prayer statistics
 */
export const getPrayerStats = (): PrayerStats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // If no stats exist, calculate from history
    const history = getPrayerHistory();
    updateStats(history);

    const newStored = localStorage.getItem(STATS_KEY);
    return newStored
      ? JSON.parse(newStored)
      : {
          currentStreak: 0,
          longestStreak: 0,
          totalPrayers: 0,
          totalMissed: 0,
          monthlyStats: {},
        };
  } catch (error) {
    console.error('Error loading stats:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalPrayers: 0,
      totalMissed: 0,
      monthlyStats: {},
    };
  }
};

/**
 * Get last 7 days history
 */
export const getLastWeekHistory = (): PrayerHistoryEntry[] => {
  const history = getPrayerHistory();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastWeek: PrayerHistoryEntry[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const entry = history.find((h) => h.date === dateStr);
    if (entry) {
      lastWeek.push(entry);
    } else {
      lastWeek.push({
        date: dateStr,
        prayers: { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false },
        completionPercentage: 0,
      });
    }
  }

  return lastWeek;
};

/**
 * Export history as JSON for backup
 */
export const exportHistory = (): string => {
  const history = getPrayerHistory();
  const stats = getPrayerStats();
  return JSON.stringify({ history, stats }, null, 2);
};

/**
 * Import history from JSON backup
 */
export const importHistory = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    if (data.history && Array.isArray(data.history)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.history));
      updateStats(data.history);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing history:', error);
    return false;
  }
};
