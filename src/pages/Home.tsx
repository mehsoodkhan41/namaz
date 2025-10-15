import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, RefreshCw, Info, Sunrise, Sun, Sunset, Moon, Bell, BellOff, CheckCircle, Circle, Navigation, Minus, Plus, RotateCcw, Moon as MoonIcon, TrendingUp, Calendar, Share2 } from 'lucide-react';
import { provinces } from '../data/cities';
import { fetchPrayerTimes, PrayerTimesResponse, formatTime } from '../services/prayerTimesApi';
import { savePrayerEntry, getPrayerStats, getLastWeekHistory, type PrayerStats } from '../services/prayerHistory';

const DAILY_GEMS = [
  {
    type: 'verse',
    reference: { ur: 'سورۃ البقرۃ 2:286', en: 'Surah Al-Baqarah 2:286' },
    arabic: 'لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    translation: {
      ur: 'اللہ کسی جان پر اس کی طاقت سے بڑھ کر بوجھ نہیں ڈالتا۔',
      en: 'Allah does not burden a soul beyond what it can bear.'
    },
    reflection: {
      ur: 'ہر آزمائش کے ساتھ اللہ آسانی بھی دیتا ہے۔',
      en: 'Every test comes with ease from Allah.'
    }
  },
  {
    type: 'hadith',
    reference: { ur: 'صحیح مسلم', en: 'Sahih Muslim' },
    arabic: 'الطُّهُورُ شَطْرُ الْإِيمَانِ',
    translation: {
      ur: 'پاکیزگی ایمان کا نصف حصہ ہے۔',
      en: 'Purity is half of faith.'
    },
    reflection: {
      ur: 'وضو اور طہارت دلی سکون کا سبب بنتے ہیں۔',
      en: 'Wudu and cleanliness bring calm to the heart.'
    }
  },
  {
    type: 'verse',
    reference: { ur: 'سورۃ الرحمن 55:13', en: 'Surah Ar-Rahman 55:13' },
    arabic: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
    translation: {
      ur: 'پس تم اپنے رب کی کون کون سی نعمتوں کو جھٹلاؤں گے؟',
      en: 'Which of your Lord’s favours will you both deny?'
    },
    reflection: {
      ur: 'زندگی کی نعمتوں پر شکر گزاری کو معمول بنائیں۔',
      en: 'Make gratitude for life’s blessings a habit.'
    }
  },
  {
    type: 'hadith',
    reference: { ur: 'جامع الترمذی', en: 'Jami` at-Tirmidhi' },
    arabic: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    translation: {
      ur: 'لوگوں میں سے بہترین وہ ہے جو دوسروں کے لیے سب سے زیادہ فائدہ مند ہو۔',
      en: 'The best of people are those most beneficial to others.'
    },
    reflection: {
      ur: 'خدمت خلق کو اپنی روزمرہ روٹین کا حصہ بنائیں۔',
      en: 'Weave service to others into your daily routine.'
    }
  },
  {
    type: 'verse',
    reference: { ur: 'سورۃ آل عمران 3:159', en: 'Surah Aal Imran 3:159' },
    arabic: 'فَبِمَا رَحْمَةٍ مِّنَ ٱللَّهِ لِنتَ لَهُمْ',
    translation: {
      ur: 'اللہ کی رحمت سے آپ ان کے لیے نرم دل ہوئے۔',
      en: 'It was by Allah’s mercy that you were gentle with them.'
    },
    reflection: {
      ur: 'نرمی اور حسنِ اخلاق سے ہی دل جیتے جاتے ہیں۔',
      en: 'Hearts are won through gentleness and good character.'
    }
  }
];

interface HomeProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  azanSound: string;
  language: 'ur' | 'en';
  showTasbih?: boolean;
  setShowTasbih?: (value: boolean) => void;
  showQibla?: boolean;
  setShowQibla?: (value: boolean) => void;
  showDuas?: boolean;
  setShowDuas?: (value: boolean) => void;
  onTasbihClick?: () => void;
  onQiblaClick?: () => void;
  onDuasClick?: () => void;
  onLocationClick?: () => void;
  registerDetectLocation?: (fn: () => void) => void;
}

function Home({
  darkMode,
  setDarkMode,
  notificationsEnabled,
  setNotificationsEnabled,
  azanSound,
  language,
  showTasbih: showTasbihProp,
  setShowTasbih: setShowTasbihProp,
  showQibla: showQiblaProp,
  setShowQibla: setShowQiblaProp,
  showDuas: showDuasProp,
  setShowDuas: setShowDuasProp,
  onTasbihClick,
  onQiblaClick,
  onDuasClick,
  onLocationClick,
  registerDetectLocation
}: HomeProps) {
  const [selectedProvince, setSelectedProvince] = useState(() => {
    return localStorage.getItem('selectedProvince') || 'Punjab';
  });
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('selectedCity') || 'Lahore';
  });
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const isEnglish = language === 'en';
  const dir = isEnglish ? 'ltr' : 'rtl';
  const t = (urdu: string, english: string) => (isEnglish ? english : urdu);

  // New state for enhanced features
  const [prayerStatus, setPrayerStatus] = useState<{[key: string]: boolean}>({
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false
  });
  const [tasbihCount, setTasbihCount] = useState(() => {
    const saved = localStorage.getItem('tasbihCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Use props if available, otherwise use local state
  const [showTasbihLocal, setShowTasbihLocal] = useState(false);
  const [showQiblaLocal, setShowQiblaLocal] = useState(false);
  const [showDuasLocal, setShowDuasLocal] = useState(false);

  const showTasbih = showTasbihProp !== undefined ? showTasbihProp : showTasbihLocal;
  const setShowTasbih = setShowTasbihProp || setShowTasbihLocal;
  const showQibla = showQiblaProp !== undefined ? showQiblaProp : showQiblaLocal;
  const setShowQibla = setShowQiblaProp || setShowQiblaLocal;
  const showDuas = showDuasProp !== undefined ? showDuasProp : showDuasLocal;
  const setShowDuas = setShowDuasProp || setShowDuasLocal;

  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [compassSupported, setCompassSupported] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showRamadan, setShowRamadan] = useState(false);
  const [isRamadan, setIsRamadan] = useState(false);
  const azanAudioRef = useRef<HTMLAudioElement | null>(null);

  const azanSoundMap: Record<string, string> = {
    classic: '/audio/azan-classic.mp3',
    madina: '/audio/azan-madina.mp3',
    short: '/audio/azan-short.mp3'
  };

  // Prayer History & Stats
  const [showStats, setShowStats] = useState(false);
  const [prayerStats, setPrayerStats] = useState<PrayerStats>(getPrayerStats());

  // Prepare Azan audio whenever sound selection changes
  useEffect(() => {
    const source = azanSoundMap[azanSound] ?? azanSoundMap.classic;
    const audio = new Audio(source);
    audio.preload = 'auto';
    azanAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [azanSound]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Register navbar callbacks
  useEffect(() => {
    if (onTasbihClick) {
      // Navbar callback will trigger setShowTasbih(true)
    }
  }, [onTasbihClick, onQiblaClick, onDuasClick, onLocationClick]);

  // Load prayer status from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('prayerStatus');
    if (saved) {
      const parsedStatus = JSON.parse(saved);
      const savedDate = localStorage.getItem('prayerStatusDate');
      const today = new Date().toDateString();

      // Reset if it's a new day
      if (savedDate !== today) {
        localStorage.setItem('prayerStatusDate', today);
        setPrayerStatus({
          Fajr: false,
          Dhuhr: false,
          Asr: false,
          Maghrib: false,
          Isha: false
        });
      } else {
        setPrayerStatus(parsedStatus);
      }
    }
  }, []);

  // Save prayer status to localStorage and history
  useEffect(() => {
    localStorage.setItem('prayerStatus', JSON.stringify(prayerStatus));

    // Save to prayer history
    const today = new Date().toISOString().split('T')[0];
    savePrayerEntry(today, prayerStatus);

    // Update stats
    setPrayerStats(getPrayerStats());
  }, [prayerStatus]);

  // Save city selection to localStorage
  useEffect(() => {
    localStorage.setItem('selectedProvince', selectedProvince);
    localStorage.setItem('selectedCity', selectedCity);
  }, [selectedProvince, selectedCity]);

  // Save tasbih count to localStorage
  useEffect(() => {
    localStorage.setItem('tasbihCount', tasbihCount.toString());
  }, [tasbihCount]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
      } else {
        setNotificationsEnabled(false);
        window.alert(t('براہ کرم اپنے براؤزر میں نوٹیفکیشن کی اجازت دیں۔', 'Please allow notifications in your browser settings.'));
      }
    } else {
      setNotificationsEnabled(true);
    }
  };

  // Check for upcoming prayers and send notifications
  useEffect(() => {
    if (!notificationsEnabled || !prayerTimes) return;
    const playAzan = () => {
      const audio = azanAudioRef.current;
      if (!audio) return;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore autoplay restriction errors; user interaction will be required
      });
    };

    const checkInterval = setInterval(() => {
      const now = new Date();
      prayerNames.forEach(prayer => {
        const prayerTime = prayerTimes.data.timings[prayer.english as keyof typeof prayerTimes.data.timings];
        const [hours, minutes] = prayerTime.split(':').map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);

        const timeDiff = prayerDate.getTime() - now.getTime();
        const minutesDiff = Math.floor(timeDiff / 60000);
        const prayerLabel = prayer.labels[language];
        const prayerLabelUr = prayer.labels.ur;

        // Notify 5 minutes before
        if (minutesDiff === 5) {
          if (Notification.permission === 'granted') {
            new Notification(t(`${prayerLabelUr} کا وقت`, `${prayerLabel} time`), {
              body: t(`5 منٹ میں ${prayerLabelUr} کا وقت ہو جائے گا`, `${prayerLabel} starts in five minutes`),
              icon: '/prayer-icon.png'
            });
          }
        }

        // Notify at prayer time
        if (minutesDiff === 0) {
          if (Notification.permission === 'granted') {
            new Notification(t(`${prayerLabelUr} کا وقت`, `${prayerLabel} time`), {
              body: t(`${prayerLabelUr} کا وقت ہو گیا ہے`, `${prayerLabel} has started`),
              icon: '/prayer-icon.png'
            });
          }
          playAzan();
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, [notificationsEnabled, prayerTimes, language]);

  // Calculate Qibla direction
  const calculateQiblaDirection = (lat: number, lng: number) => {
    // Kaaba coordinates (Masjid al-Haram, Makkah)
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;

    const φ1 = lat * Math.PI / 180;
    const φ2 = kaabaLat * Math.PI / 180;
    const Δλ = (kaabaLng - lng) * Math.PI / 180;

    // Use great-circle initial bearing so compass points towards Makkah
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);
    const bearing = (θ * 180 / Math.PI + 360) % 360;

    return bearing;
  };

  // Get next prayer and countdown
  const getNextPrayer = () => {
    if (!prayerTimes) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayerNames) {
      const prayerTime = prayerTimes.data.timings[prayer.english as keyof typeof prayerTimes.data.timings];
      const [hours, minutes] = prayerTime.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;

      if (prayerMinutes > currentMinutes) {
        const diff = prayerMinutes - currentMinutes;
        const hoursLeft = Math.floor(diff / 60);
        const minutesLeft = diff % 60;
        return {
          name: prayer.labels[language],
          nameUrdu: prayer.labels.ur,
          english: prayer.english,
          time: prayerTime,
          countdown: t(`${hoursLeft} گھنٹے ${minutesLeft} منٹ`, `${hoursLeft}h ${minutesLeft}m`)
        };
      }
    }

    // If no prayer left today, return Fajr for tomorrow
    const fajrTime = prayerTimes.data.timings.Fajr;
    const [hours, minutes] = fajrTime.split(':').map(Number);
    const fajrMinutes = hours * 60 + minutes;
    const diff = (24 * 60 - currentMinutes) + fajrMinutes;
    const hoursLeft = Math.floor(diff / 60);
    const minutesLeft = diff % 60;

    return {
      name: t('فجر (کل)', 'Fajr (tomorrow)'),
      nameUrdu: 'فجر (کل)',
      english: 'Fajr',
      time: fajrTime,
      countdown: t(`${hoursLeft} گھنٹے ${minutesLeft} منٹ`, `${hoursLeft}h ${minutesLeft}m`)
    };
  };

  // Toggle prayer status
  const togglePrayerStatus = (prayer: string) => {
    setPrayerStatus(prev => ({
      ...prev,
      [prayer]: !prev[prayer]
    }));
  };

  // Tasbih counter functions
  const incrementTasbih = () => setTasbihCount(prev => prev + 1);
  const resetTasbih = () => setTasbihCount(0);

  // GPS Location detection
  const detectLocation = () => {
    setLocationLoading(true);
    setError('');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Calculate Qibla
          const qibla = calculateQiblaDirection(latitude, longitude);
          setQiblaDirection(qibla);

          // Find nearest city
          let nearestCity = null;
          let minDistance = Infinity;

          provinces.forEach(province => {
            province.cities.forEach(city => {
              const distance = Math.sqrt(
                Math.pow(city.latitude - latitude, 2) +
                Math.pow(city.longitude - longitude, 2)
              );

              if (distance < minDistance) {
                minDistance = distance;
                nearestCity = { province: province.name, city: city.name };
              }
            });
          });

          if (nearestCity) {
            setSelectedProvince(nearestCity.province);
            setSelectedCity(nearestCity.city);
          }

          setLocationLoading(false);
        },
        (error) => {
          setError(t('مقام کی معلومات حاصل نہیں کی جا سکیں', 'Unable to fetch your location.'));
          setLocationLoading(false);
        }
      );
    } else {
      setError(t('آپ کا براؤزر GPS کو سپورٹ نہیں کرتا', 'Your browser does not support GPS.'));
      setLocationLoading(false);
    }
  };

  const openMosqueLocator = () => {
    const fallbackUrl = 'https://www.google.com/maps/search/mosque';
    if (!('geolocation' in navigator)) {
      window.open(fallbackUrl, '_blank', 'noopener');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps/search/mosque/@${latitude},${longitude},14z`;
        window.open(url, '_blank', 'noopener');
      },
      () => {
        window.open(fallbackUrl, '_blank', 'noopener');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  };

  // Register detectLocation function with parent
  useEffect(() => {
    if (registerDetectLocation) {
      registerDetectLocation(detectLocation);
    }
  }, [registerDetectLocation]);

  // Device Orientation for Compass
  useEffect(() => {
    if (!showQibla) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // Alpha gives the compass heading (0-360 degrees)
        // We need to account for device orientation
        let heading = event.alpha;

        // Adjust for screen orientation
        if (window.screen && (window.screen.orientation || (window.screen as any).mozOrientation || (window.screen as any).msOrientation)) {
          const screenOrientation = window.screen.orientation?.angle || 0;
          heading = (heading + screenOrientation) % 360;
        }

        setDeviceHeading(heading);
      } else {
        setCompassSupported(false);
      }
    };

    // Check if DeviceOrientationEvent is supported
    if (typeof DeviceOrientationEvent !== 'undefined') {
      // For iOS 13+ devices, request permission
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        (DeviceOrientationEvent as any).requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true);
            } else {
              setCompassSupported(false);
            }
          })
          .catch(() => {
            setCompassSupported(false);
          });
      } else {
        // For non-iOS devices or older iOS versions
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    } else {
      setCompassSupported(false);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [showQibla]);

  // Dua Collection
  const duas = [
    {
      title: { ur: 'صبح کی دعا', en: 'Morning supplication' },
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
      translation: {
        ur: 'ہم نے صبح کی اور ساری کائنات اللہ کی ملکیت میں ہے، اور تمام تعریفیں اللہ کے لیے ہیں',
        en: 'We have entered this morning and so has the dominion of Allah. All praise belongs to Allah.'
      },
      transliteration: 'Asbahna wa asbahal mulku lillah, walhamdu lillah'
    },
    {
      title: { ur: 'کھانے سے پہلے', en: 'Before eating' },
      arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
      translation: {
        ur: 'اللہ کے نام سے اور اللہ کی برکت کے ساتھ',
        en: 'In the name of Allah and with His blessings.'
      },
      transliteration: 'Bismillahi wa ala barakatillah'
    },
    {
      title: { ur: 'کھانے کے بعد', en: 'After eating' },
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
      translation: {
        ur: 'تمام تعریفیں اللہ کے لیے جس نے ہمیں کھلایا، پلایا اور مسلمان بنایا',
        en: 'All praise is for Allah who fed us, gave us drink, and made us Muslims.'
      },
      transliteration: 'Alhamdulillahil lazi at\'amana wa saqana wa ja\'alana muslimeen'
    },
    {
      title: { ur: 'گھر سے نکلتے وقت', en: 'Leaving home' },
      arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
      translation: {
        ur: 'اللہ کے نام سے، میں نے اللہ پر بھروسہ کیا، اور کوئی طاقت اور قوت نہیں مگر اللہ کی طرف سے',
        en: 'In the name of Allah, I rely upon Allah; there is no power nor might except with Allah.'
      },
      transliteration: 'Bismillahi tawakkaltu alallahi wa la hawla wa la quwwata illa billah'
    },
    {
      title: { ur: 'گھر میں داخل ہوتے وقت', en: 'Entering home' },
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ',
      translation: {
        ur: 'اے اللہ! میں تجھ سے داخل ہونے اور نکلنے کی بھلائی مانگتا ہوں',
        en: 'O Allah! I ask You for the best entry and the best exit.'
      },
      transliteration: 'Allahumma inni as\'aluka khayral mawliji wa khayral makhraji'
    },
    {
      title: { ur: 'سونے سے پہلے', en: 'Before sleeping' },
      arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
      translation: {
        ur: 'اے اللہ! تیرے نام کے ساتھ میں مرتا ہوں اور زندہ ہوتا ہوں',
        en: 'In Your name, O Allah, I die and I live.'
      },
      transliteration: 'Bismika Allahumma amutu wa ahya'
    },
    {
      title: { ur: 'جاگنے پر', en: 'Upon waking' },
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      translation: {
        ur: 'تمام تعریفیں اللہ کے لیے جس نے مرنے کے بعد ہمیں زندہ کیا اور اسی کی طرف لوٹنا ہے',
        en: 'All praise is for Allah who gave us life after causing us to die; to Him is the resurrection.'
      },
      transliteration: 'Alhamdulillahil lazi ahyana ba\'da ma amatana wa ilayhin nushur'
    },
    {
      title: { ur: 'مسجد میں داخل ہوتے وقت', en: 'Entering the mosque' },
      arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
      translation: {
        ur: 'اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے',
        en: 'O Allah! Open the doors of Your mercy for me.'
      },
      transliteration: 'Allahumma-ftah li abwaba rahmatik'
    },
    {
      title: { ur: 'مسجد سے نکلتے وقت', en: 'Leaving the mosque' },
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
      translation: {
        ur: 'اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں',
        en: 'O Allah! I ask You from Your bounty.'
      },
      transliteration: 'Allahumma inni as\'aluka min fadlik'
    },
    {
      title: { ur: 'سفر کی دعا', en: 'Travel supplication' },
      arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
      translation: {
        ur: 'پاک ہے وہ ذات جس نے اس کو ہمارے لیے مسخر کر دیا، ورنہ ہم اس پر قابو نہ پا سکتے',
        en: 'Glory be to the One who has subjected this to us, for we could never have controlled it ourselves.'
      },
      transliteration: 'Subhanal lazi sakhkhara lana haza wa ma kunna lahu muqrineen'
    }
  ];


  // Check if it's Ramadan (approximate - you can make this more accurate)
  useEffect(() => {
    const checkRamadan = () => {
      if (!prayerTimes) return;

      // Check if Hijri month is Ramadan (month 9)
      const hijriMonth = prayerTimes.data.date.hijri.month.number;
      setIsRamadan(hijriMonth === 9);
    };

    checkRamadan();
  }, [prayerTimes]);

  // Get Sehri and Iftar times (Fajr - 10 mins for Sehri, Maghrib for Iftar)
  const getRamadanTimes = () => {
    if (!prayerTimes) return null;

    const fajrTime = prayerTimes.data.timings.Fajr;
    const maghribTime = prayerTimes.data.timings.Maghrib;

    // Calculate Sehri time (10 minutes before Fajr)
    const [fajrHours, fajrMinutes] = fajrTime.split(':').map(Number);
    let sehriMinutes = fajrMinutes - 10;
    let sehriHours = fajrHours;

    if (sehriMinutes < 0) {
      sehriMinutes += 60;
      sehriHours -= 1;
      if (sehriHours < 0) sehriHours += 24;
    }

    const sehriTime = `${String(sehriHours).padStart(2, '0')}:${String(sehriMinutes).padStart(2, '0')}`;

    return {
      sehri: sehriTime,
      iftar: maghribTime
    };
  };

  const getPrayerTimes = async () => {
    setLoading(true);
    setError('');

    try {
      const province = provinces.find(p => p.name === selectedProvince);
      const city = province?.cities.find(c => c.name === selectedCity);

      if (!city) {
        throw new Error(t('شہر نہیں ملا', 'City not found.'));
      }

      const times = await fetchPrayerTimes(city.latitude, city.longitude);
      setPrayerTimes(times);

      // Calculate Qibla for selected city
      const qibla = calculateQiblaDirection(city.latitude, city.longitude);
      setQiblaDirection(qibla);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('اوقات حاصل کرنے میں خرابی ہوئی', 'Failed to load timings.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPrayerTimes();
  }, [selectedCity, selectedProvince]);

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    const firstCity = provinces.find(p => p.name === province)?.cities[0];
    if (firstCity) {
      setSelectedCity(firstCity.name);
    }
  };

  const currentProvince = provinces.find(p => p.name === selectedProvince);
  const currentCity = currentProvince?.cities.find(c => c.name === selectedCity);
  const displayCityName = currentCity ? (isEnglish ? currentCity.name : currentCity.nameUrdu) : '';
  const cityHeading = displayCityName
    ? (isEnglish ? `Prayer times for ${displayCityName}` : `${displayCityName} کے نماز کے اوقات`)
    : t('نماز کے اوقات', 'Prayer times');

  const getPrayerIcon = (prayerName: string) => {
    const iconProps = { className: "w-6 h-6" };
    switch (prayerName) {
      case 'Fajr':
        return <Sunrise {...iconProps} className="w-6 h-6 text-blue-600" />;
      case 'Dhuhr':
        return <Sun {...iconProps} className="w-6 h-6 text-yellow-600" />;
      case 'Asr':
        return <Sun {...iconProps} className="w-6 h-6 text-orange-600" />;
      case 'Maghrib':
        return <Sunset {...iconProps} className="w-6 h-6 text-red-600" />;
      case 'Isha':
        return <Moon {...iconProps} className="w-6 h-6 text-indigo-600" />;
      default:
        return <Clock {...iconProps} />;
    }
  };

  const prayerNames = [
    { english: 'Fajr', labels: { ur: 'فجر', en: 'Fajr' }, emoji: '🌅' },
    { english: 'Dhuhr', labels: { ur: 'ظہر', en: 'Dhuhr' }, emoji: '☀️' },
    { english: 'Asr', labels: { ur: 'عصر', en: 'Asr' }, emoji: '🌇' },
    { english: 'Maghrib', labels: { ur: 'مغرب', en: 'Maghrib' }, emoji: '🌆' },
    { english: 'Isha', labels: { ur: 'عشاء', en: 'Isha' }, emoji: '🌙' }
  ];

  const dailyGem = React.useMemo(() => {
    if (!DAILY_GEMS.length) return null;
    const startOfYear = new Date(currentTime.getFullYear(), 0, 0);
    const diff = currentTime.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % DAILY_GEMS.length;
    return DAILY_GEMS[index];
  }, [currentTime]);

  const shareDailyGem = () => {
    if (!dailyGem) return;
    const text = `${dailyGem.reference[language]}\n${dailyGem.arabic}\n${dailyGem.translation[language]}\n${dailyGem.reflection[language]}`;
    if (navigator.share) {
      navigator.share({
        title: t('آج کا پیغام', 'Daily inspiration'),
        text
      }).catch(() => {
        // user cancelled share, no need to handle
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert(t('پیغام کلپ بورڈ میں کاپی ہو گیا ہے۔', 'Message copied to clipboard.'));
        })
        .catch(() => {
          alert(t('پیغام شیئر کرنے میں مسئلہ پیش آیا، براہ کرم دوبارہ کوشش کریں۔', 'Unable to share the message. Please try again.'));
        });
    } else {
      alert(t('یہ فیچر آپ کے ڈیوائس پر دستیاب نہیں ہے۔', 'This feature is not available on your device.'));
    }
  };

  const nextPrayer = getNextPrayer();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">

      {/* Header with Dark Mode Toggle */}
      <header className="surface-hero mb-8 rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 bg-white/20 hover:bg-white/30 border border-white/25 text-white shadow-lg backdrop-blur-md"
              title={isEnglish ? (darkMode ? 'Light mode' : 'Dark mode') : (darkMode ? 'لائٹ موڈ' : 'ڈارک موڈ')}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {
                if (notificationsEnabled) {
                  setNotificationsEnabled(false);
                } else {
                  requestNotificationPermission();
                }
              }}
              className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 bg-white/20 hover:bg-white/30 border border-white/25 text-white shadow-lg backdrop-blur-md"
              title={isEnglish ? (notificationsEnabled ? 'Notifications on' : 'Notifications off') : (notificationsEnabled ? 'نوٹیفکیشنز آن ہیں' : 'نوٹیفکیشنز آف ہیں')}
            >
              {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>
            <button
              onClick={detectLocation}
              disabled={locationLoading}
              className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 bg-white/20 hover:bg-white/30 border border-white/25 text-white shadow-lg backdrop-blur-md"
              title={t('GPS سے مقام تلاش کریں', 'Find location via GPS')}
            >
              <MapPin className={`w-5 h-5 ${locationLoading ? 'animate-pulse' : ''}`} />
            </button>
          </div>

          <div className={`pr-4 pt-0 md:pt-0 ${isEnglish ? 'text-left' : 'text-right'}`} dir={dir}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 mt-12 md:mt-0 drop-shadow-lg">
              {t('اوقات نماز پاکستان', 'Prayer Times Pakistan')}
            </h1>
            <p className="text-base sm:text-lg mb-2 drop-shadow-md text-white/95">
              {t('جامعہ اسلامک سائنسز کراچی کے حنفی طریقہ کے مطابق', 'Following the Hanafi method of Jamiat-ul-Uloom-Al-Islamiyah, Karachi')}
            </p>
            <p className="text-xs sm:text-sm drop-shadow-md text-white/85">
              {t('یونیورسٹی آف اسلامک سائنسز، کراچی - حنفی طریقہ', 'University of Islamic Sciences, Karachi - Hanafi Method')}
            </p>
          </div>
        </header>

        {/* Next Prayer Countdown */}
        {nextPrayer && (
          <div className="surface-spotlight rounded-3xl p-6 mb-6 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] text-white">
            <h3 className="text-center text-lg font-semibold mb-2 drop-shadow-md" dir={dir}>
              {t('اگلی نماز', 'Next prayer')}
            </h3>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1 drop-shadow-lg" dir={dir}>{nextPrayer.name}</p>
              <p className="text-xl mb-2 drop-shadow-md">{formatTime(nextPrayer.time)}</p>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 drop-shadow-md" />
                <p className="text-lg drop-shadow-md" dir={dir}>{t(`${nextPrayer.countdown} باقی`, `${nextPrayer.countdown} remaining`)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Current Time */}
        <div className="surface-panel p-5 mb-6 text-center relative rounded-3xl backdrop-blur-sm transition-all duration-300 hover:shadow-3xl">
          <div className="text-2xl font-bold mb-1">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}
          </div>
          <div className="text-slate-600 dark:text-slate-200" dir={dir}>
            {currentTime.toLocaleDateString(isEnglish ? 'en-GB' : 'ur-PK', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {dailyGem && (
          <div className="surface-panel p-6 mb-6 rounded-3xl shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-3xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-emerald-500 dark:text-emerald-300">{t('آج کا پیغام', 'Daily inspiration')}</p>
                <p className="text-lg font-semibold" dir={dir}>{dailyGem.reference[language]}</p>
              </div>
              <button onClick={shareDailyGem} className="icon-button p-2 rounded-lg flex items-center gap-2 text-sm">
                <Share2 className="w-4 h-4" />
                <span>{t('شیئر', 'Share')}</span>
              </button>
            </div>
            <p className="text-2xl leading-[1.8] mb-3" dir="rtl">{dailyGem.arabic}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2" dir={dir}>{dailyGem.translation[language]}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400" dir={dir}>{dailyGem.reflection[language]}</p>
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <button
            onClick={() => setShowTasbih(!showTasbih)}
            className="surface-ocean p-5 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 backdrop-blur-sm text-white"
          >
            <div className="flex items-center justify-center gap-2">
              <Plus className="w-5 h-5 drop-shadow-md" />
              <span className="font-semibold drop-shadow-md" dir={dir}>{t('تسبیح', 'Tasbih')}</span>
            </div>
          </button>
          <button
            onClick={() => setShowQibla(!showQibla)}
            className="surface-amber p-5 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 backdrop-blur-sm text-white"
          >
            <div className="flex items-center justify-center gap-2">
              <Navigation className="w-5 h-5 drop-shadow-md" />
              <span className="font-semibold drop-shadow-md" dir={dir}>{t('قبلہ', 'Qibla')}</span>
            </div>
          </button>
          <button
            onClick={() => setShowDuas(!showDuas)}
            className="surface-accent p-5 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-2">
              <Info className="w-5 h-5 drop-shadow-md" />
              <span className="font-semibold drop-shadow-md" dir={dir}>{t('دعائیں', 'Duas')}</span>
            </div>
          </button>
          <button
            onClick={openMosqueLocator}
            className="surface-panel p-5 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 backdrop-blur-sm text-emerald-700 dark:text-emerald-200"
          >
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 drop-shadow-md" />
              <span className="font-semibold drop-shadow-md" dir={dir}>{t('قریب کی مساجد', 'Nearby mosques')}</span>
            </div>
          </button>
          {isRamadan && (
            <button
              onClick={() => setShowRamadan(!showRamadan)}
              className="surface-success p-5 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center gap-2">
                <Moon className="w-5 h-5 drop-shadow-md" />
                <span className="font-semibold drop-shadow-md" dir={dir}>{t('رمضان', 'Ramadan')}</span>
              </div>
            </button>
          )}
        </div>

        {/* Tasbih Counter Modal */}
        {showTasbih && (
          <div className="surface-panel rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" dir={dir}>{t('تسبیح کاؤنٹر', 'Tasbih counter')}</h3>
              <button onClick={() => setShowTasbih(false)} className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>×</button>
            </div>
            <div className="text-center">
              <div className={`text-7xl font-bold mb-8 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                {tasbihCount}
              </div>
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={incrementTasbih}
                  className={`w-32 h-32 rounded-full text-white font-bold text-2xl shadow-2xl transition-all ${darkMode ? 'bg-gradient-to-br from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 active:scale-95' : 'bg-gradient-to-br from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 active:scale-95'}`}
                >
                  <Plus className="w-12 h-12 mx-auto" />
                </button>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setTasbihCount(prev => Math.max(0, prev - 1))}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <button
                  onClick={resetTasbih}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${darkMode ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
              {tasbihCount >= 33 && tasbihCount % 33 === 0 && (
                <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-teal-900/50 text-teal-200' : 'bg-teal-100 text-teal-800'}`}>
                  <p className="font-semibold" dir={dir}>{t(`سبحان اللہ! ${tasbihCount / 33} دفعہ مکمل`, `SubhanAllah! ${tasbihCount / 33} round(s) complete`)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Qibla Direction */}
        {showQibla && qiblaDirection !== null && (
          <div className="surface-panel rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" dir={dir}>{t('قبلہ کا رُخ', 'Qibla direction')}</h3>
              <button onClick={() => setShowQibla(false)} className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>×</button>
            </div>

            {!compassSupported && (
              <div className={`mb-4 p-4 rounded-lg ${darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border`}>
                <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`} dir={dir}>
                  {t('آپ کا ڈیوائس کمپاس کو سپورٹ نہیں کرتا۔ براہ کرم اپنے فون کو دستی طور پر گھمائیں۔', 'Your device does not support compass. Please rotate your phone manually.')}
                </p>
              </div>
            )}

            <div className="text-center">
              {/* Compass Circle */}
              <div className="relative w-72 h-72 mx-auto mb-4">
                {/* Outer Circle */}
                <div className={`absolute inset-0 rounded-full border-8 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>

                {/* Cardinal Directions */}
                <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 font-bold text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>N</div>
                <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 font-bold text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>S</div>
                <div className={`absolute left-2 top-1/2 transform -translate-y-1/2 font-bold text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>W</div>
                <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 font-bold text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>E</div>

                {/* Rotating Compass Base (rotates with device) */}
                <div
                  className="absolute inset-0 transition-transform duration-300"
                  style={{ transform: `rotate(${-deviceHeading}deg)` }}
                >
                  {/* Degree Marks */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <div
                      key={deg}
                      className="absolute w-1 h-3 bg-gray-400 left-1/2 top-0 transform -translate-x-1/2"
                      style={{
                        transformOrigin: '50% 144px',
                        transform: `translateX(-50%) rotate(${deg}deg)`
                      }}
                    />
                  ))}
                </div>

                {/* Qibla Direction Needle (points to Qibla, adjusted for device heading) */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                  style={{ transform: `rotate(${qiblaDirection - deviceHeading}deg)` }}
                >
                  <div className="flex flex-col items-center">
                    <Navigation
                      className={`w-20 h-20 ${darkMode ? 'text-amber-400' : 'text-amber-600'} drop-shadow-lg`}
                      style={{ transform: 'rotate(-45deg)' }}
                    />
                    <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'}`}>
                      {t('قبلہ', 'Qibla')}
                    </div>
                  </div>
                </div>

                {/* Center Dot */}
                <div className={`absolute top-1/2 left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${darkMode ? 'bg-amber-400' : 'bg-amber-600'}`}></div>
              </div>

              {/* Direction Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} dir={dir}>
                    {t('قبلہ کا زاویہ', 'Qibla angle')}
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    {Math.round(qiblaDirection)}°
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} dir={dir}>
                    {t('آپ کا رخ', 'Your heading')}
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    {Math.round(deviceHeading)}°
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-200'} border`}>
                <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`} dir={dir}>
                  {t('کیسے استعمال کریں:', 'How to use:')}
                </p>
                <p className={`text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`} dir={dir}>
                  {t('اپنے فون کو افقی رکھیں اور گھمائیں۔ جب سنہری تیر شمال (N) کی طرف اشارہ کرے تو آپ قبلہ کی طرف ہیں۔', 'Hold your phone flat and rotate. When the golden arrow points to North (N), you are facing Qibla.')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dua Collection */}
        {showDuas && (
          <div className="surface-panel rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" dir={dir}>{t('روزمرہ کی دعائیں', 'Daily duas')}</h3>
              <button onClick={() => setShowDuas(false)} className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>×</button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {duas.map((dua, index) => (
                <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <h4 className="font-bold text-lg mb-2" dir={dir}>{dua.title[language]}</h4>
                  <p className="text-2xl mb-2 font-arabic leading-loose" dir="rtl">{dua.arabic}</p>
                  <p className={`text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} dir={dir}>{dua.translation[language]}</p>
                  <p className={`text-xs italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{dua.transliteration}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ramadan Features */}
        {showRamadan && isRamadan && getRamadanTimes() && (
          <div className={`rounded-2xl shadow-xl p-8 mb-6 ${darkMode ? 'bg-gradient-to-r from-green-900 to-emerald-900 text-white' : 'bg-gradient-to-r from-green-50 to-emerald-50 text-gray-900'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" dir={dir}>{t('رمضان المبارک', 'Ramadan Mubarak')}</h3>
              <button onClick={() => setShowRamadan(false)} className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>×</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sehri Time */}
              <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-teal-800/50' : 'bg-white'}`}>
                <div className="text-4xl mb-2">🌙</div>
                <h4 className="text-xl font-bold mb-2" dir={dir}>{t('سحری', 'Suhoor')}</h4>
                <p className={`text-3xl font-bold ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>
                  {formatTime(getRamadanTimes()!.sehri)}
                </p>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} dir={dir}>
                  {t('سحری کا اختتام', 'Last time to stop eating')}
                </p>
              </div>

              {/* Iftar Time */}
              <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-orange-800/50' : 'bg-white'}`}>
                <div className="text-4xl mb-2">🌅</div>
                <h4 className="text-xl font-bold mb-2" dir={dir}>{t('افطار', 'Iftar')}</h4>
                <p className={`text-3xl font-bold ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                  {formatTime(getRamadanTimes()!.iftar)}
                </p>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} dir={dir}>
                  {t('افطار کا وقت', 'Time to break the fast')}
                </p>
              </div>
            </div>

            {/* Ramadan Message */}
            <div className={`mt-6 p-4 rounded-lg text-center ${darkMode ? 'bg-green-800/50' : 'bg-green-100'}`}>
              <p className={`font-semibold ${darkMode ? 'text-green-200' : 'text-green-800'}`} dir={dir}>
                {t('رمضان المبارک! اللہ تعالیٰ سے دعا ہے کہ آپ کے روزے قبول ہوں', 'Ramadan Mubarak! May Allah accept your fasts.')}
              </p>
            </div>
          </div>
        )}

        {/* City Selection */}
        <div className={`rounded-2xl shadow-xl p-6 mb-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <h2 className={`text-xl font-semibold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`} dir={dir}>
            <MapPin className={`w-5 h-5 ${isEnglish ? 'mr-2' : 'mr-2'} ${darkMode ? 'text-teal-400' : 'text-emerald-600'}`} />
            {t('شہر منتخب کریں', 'Select your city')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Province Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 text-slate-600 dark:text-slate-200`} dir={dir}>
                {t('صوبہ', 'Province')}
              </label>
              <div className="relative">
                <select
                  value={selectedProvince}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  disabled={loading}
                  className={`appearance-none w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${isEnglish ? 'pr-10 text-left' : 'pl-10 text-right'}`}
                  style={{ direction: isEnglish ? 'ltr' : 'rtl' }}
                >
                  {provinces.map((province) => (
                    <option key={province.name} value={province.name}>
                      {isEnglish ? province.name : province.nameUrdu}
                    </option>
                  ))}
                </select>
                <span
                  className={`pointer-events-none absolute inset-y-0 flex items-center text-slate-400 dark:text-slate-500 ${isEnglish ? 'right-3' : 'left-3 rotate-180'}`}
                >
                  
                </span>
              </div>
            </div>

            {/* City Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 text-slate-600 dark:text-slate-200`} dir={dir}>
                {t('شہر', 'City')}
              </label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={loading || !selectedProvince}
                  className={`appearance-none w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${isEnglish ? 'pr-10 text-left' : 'pl-10 text-right'}`}
                  style={{ direction: isEnglish ? 'ltr' : 'rtl' }}
                >
                  {currentProvince?.cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {isEnglish ? city.name : city.nameUrdu}
                    </option>
                  ))}
                </select>
                <span
                  className={`pointer-events-none absolute inset-y-0 flex items-center text-slate-400 dark:text-slate-500 ${isEnglish ? 'right-3' : 'left-3 rotate-180'}`}
                >
                  
                </span>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-4 text-center">
            <button
              onClick={getPrayerTimes}
              disabled={loading}
              className={`font-medium py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center mx-auto ${darkMode ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'}`}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              <span dir={dir}>{t('اوقات تازہ کریں', 'Refresh timings')}</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`text-center py-12 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <RefreshCw className={`w-12 h-12 animate-spin mx-auto mb-4 ${darkMode ? 'text-teal-400' : 'text-emerald-600'}`} />
            <p className={`text-lg text-slate-600 dark:text-slate-200`} dir={dir}>{t('اوقات لوڈ ہو رہے ہیں...', 'Loading prayer times...')}</p>
            <div className={`mt-4 w-3/4 mx-auto h-4 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className={`h-full rounded-full animate-pulse ${darkMode ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`} style={{ width: '75%' }}></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`border rounded-2xl p-4 mb-6 shadow-md ${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'}`}>
            <p className={`text-center ${darkMode ? 'text-red-300' : 'text-red-800'}`} dir={dir}>{error}</p>
          </div>
        )}

        {/* Prayer Times Display */}
        {prayerTimes && !loading && (
          <div className="space-y-4">
            <div className={`rounded-2xl shadow-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`} dir={dir}>
                {cityHeading}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {prayerNames.map((prayer, index) => {
                  const time = prayerTimes.data.timings[prayer.english as keyof typeof prayerTimes.data.timings];
                  const isPrayed = prayerStatus[prayer.english];
                  return (
                    <div
                      key={prayer.english}
                      className={`rounded-3xl p-5 text-center border-2 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:scale-105 relative ${
                        darkMode
                          ? isPrayed
                            ? 'bg-gradient-to-b from-teal-800/90 to-cyan-800/90 border-teal-600/50 shadow-lg shadow-teal-900/50'
                            : 'bg-gradient-to-b from-gray-700/90 to-gray-800/90 border-gray-600/50 shadow-lg'
                          : isPrayed
                          ? 'bg-gradient-to-b from-green-400/95 to-emerald-400/95 border-green-500/30 shadow-lg shadow-green-500/30'
                          : 'bg-gradient-to-b from-white/90 to-gray-50/90 border-gray-200/30 shadow-lg'
                      }`}
                    >
                      {/* Prayer Status Checkbox */}
                      <button
                        onClick={() => togglePrayerStatus(prayer.english)}
                        className="absolute top-3 left-3 z-10 hover:scale-110 transition-transform duration-300"
                      >
                        {isPrayed ? (
                          <CheckCircle className={`w-6 h-6 drop-shadow-lg ${darkMode ? 'text-teal-300' : 'text-white'}`} />
                        ) : (
                          <Circle className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        )}
                      </button>

                      {/* Prayer Icon and Emoji */}
                      <div className="flex items-center justify-center mb-3 mt-2">
                        {getPrayerIcon(prayer.english)}
                        <span className="text-3xl ml-2 drop-shadow-md">{prayer.emoji}</span>
                      </div>

                      {/* Prayer Name */}
                      <h3 className={`font-bold text-xl mb-2 drop-shadow-md ${darkMode ? 'text-white' : isPrayed ? 'text-white' : 'text-gray-800'}`} dir={dir}>
                        {prayer.labels[language]}
                      </h3>
                      <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : isPrayed ? 'text-white/90' : 'text-gray-600'}`}>
                        {isEnglish ? prayer.labels.ur : prayer.english}
                      </p>

                      {/* Prayer Time */}
                      <div className={`rounded-2xl p-3 backdrop-blur-md border transition-all duration-300 ${
                        darkMode
                          ? isPrayed
                            ? 'bg-gray-900/60 border-teal-700/50'
                            : 'bg-gray-900/60 border-gray-700/50'
                          : isPrayed
                          ? 'bg-white/60 border-white/30'
                          : 'bg-white/60 border-gray-200/30'
                      }`}>
                        <p className={`text-2xl font-bold drop-shadow-md ${
                          darkMode
                            ? isPrayed
                              ? 'text-teal-300'
                              : 'text-cyan-300'
                            : isPrayed
                            ? 'text-white'
                            : 'text-teal-700'
                        }`}>
                          {formatTime(time)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Prayer Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium text-slate-600 dark:text-slate-200`} dir={dir}>
                    {t('آج کی نمازیں', 'Prayers completed today')}
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-teal-400' : 'text-emerald-600'}`}>
                    {Object.values(prayerStatus).filter(Boolean).length} / 5
                  </span>
                </div>
                <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${darkMode ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
                    style={{ width: `${(Object.values(prayerStatus).filter(Boolean).length / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Date Information */}
            <div className={`rounded-2xl shadow-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`} dir={dir}>
                    {t('عیسوی تاریخ', 'Gregorian date')}
                  </h4>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-700'} dir={dir}>
                    {prayerTimes.data.date.readable}
                  </p>
                </div>
                <div>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`} dir={dir}>
                    {t('ہجری تاریخ', 'Hijri date')}
                  </h4>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-700'}`} dir={dir}>
                    {prayerTimes.data.date.hijri.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Important Information */}
        <div className={`mt-8 rounded-2xl p-6 border shadow-lg ${darkMode ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-800' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'}`}>
          <div className="flex items-center mb-4">
            <Info className={`w-5 h-5 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`} dir={dir}>{t('اہم معلومات', 'Important notes')}</h3>
          </div>
          <div className={`space-y-2 text-sm leading-relaxed ${darkMode ? 'text-blue-300' : 'text-blue-700'}`} dir={dir}>
            <p>• {t('یہ اوقات جامعہ اسلامک سائنسز کراچی کے حنفی طریقہ کار کے مطابق ہیں۔', 'Timings follow the Hanafi method of the University of Islamic Sciences, Karachi.')}</p>
            <p>• {t('حنفی فقہ میں عصر اور عشاء کا وقت دیگر مذاہب سے مختلف ہے۔', 'In the Hanafi school, Asr and Isha times differ from other methods.')}</p>
            <p>• {t('نماز کے اوقات میں معمولی فرق ہو سکتا ہے جو مقام اور موسمی حالات پر منحصر ہے۔', 'Minor variations may occur based on location and seasonal conditions.')}</p>
            <p>• {t('برائے کرم اپنے مقامی مسجد سے بھی اوقات کی تصدیق کریں۔', 'Please cross-check with your local masjid as well.')}</p>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-8 text-center text-sm border-t pt-6 ${darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'}`}>
          <p dir={dir}>{t('© 2025 اوقات نماز پاکستان - تمام حقوق محفوظ ہیں', '© 2025 Prayer Times Pakistan - All rights reserved')}</p>
          <p className="mt-1">{t('Prayer Times Pakistan - All Rights Reserved', 'Prayer Times Pakistan - All Rights Reserved')}</p>
        </footer>
      </div>
  );
}

export default Home;
