export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
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
  longitude: number
): Promise<PrayerTimesResponse> => {
  try {
    // Using method=2 (University of Islamic Sciences, Karachi) with school=1 (Hanafi)
    // This ensures proper Hanafi calculations for Asr and Isha prayers
    const response = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2&school=1`
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
  
  const period = hour >= 12 ? 'شام' : 'صبح';
  const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  
  return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
};