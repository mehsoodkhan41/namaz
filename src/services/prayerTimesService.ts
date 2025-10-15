export interface PrayerTime {
  name: string;
  nameUrdu: string;
  time: string;
  timestamp: number;
}

export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
      Sunrise: string;
      Sunset: string;
    };
    date: {
      readable: string;
      gregorian: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
        };
        month: {
          number: number;
          en: string;
        };
        year: string;
      };
      hijri: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
          ar: string;
        };
        month: {
          number: number;
          en: string;
          ar: string;
        };
        year: string;
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
        params: object;
      };
    };
  };
}

export const fetchPrayerTimes = async (
  latitude: number,
  longitude: number,
  method: number = 1
): Promise<PrayerTimesResponse> => {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}&tune=0,0,0,0,0,0,0,0,0`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);
  
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  
  return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
};

export const parseTime = (timeString: string): Date => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return date;
};

export const getTimeRemaining = (targetTime: Date): { hours: number; minutes: number; seconds: number } => {
  const now = new Date();
  const diff = targetTime.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
};

export const getNextPrayer = (prayerTimes: PrayerTime[]): PrayerTime | null => {
  const now = new Date();
  
  for (const prayer of prayerTimes) {
    const prayerTime = new Date(prayer.timestamp);
    if (prayerTime > now) {
      return prayer;
    }
  }
  
  // If no prayer is found for today, return the first prayer of tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const firstPrayer = prayerTimes[0];
  if (firstPrayer) {
    const tomorrowPrayer = new Date(firstPrayer.timestamp);
    tomorrowPrayer.setDate(tomorrow.getDate());
    
    return {
      ...firstPrayer,
      timestamp: tomorrowPrayer.getTime()
    };
  }
  
  return null;
};