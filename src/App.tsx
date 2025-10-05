import React, { useState, useEffect } from 'react';
import { MapPin, Clock, RefreshCw, Info, Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import { provinces } from './data/cities';
import { fetchPrayerTimes, PrayerTimesResponse, formatTime } from './services/prayerTimesApi';

function App() {
  const [selectedProvince, setSelectedProvince] = useState('Punjab');
  const [selectedCity, setSelectedCity] = useState('Lahore');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPrayerTimes = async () => {
    setLoading(true);
    setError('');
    
    try {
      const province = provinces.find(p => p.name === selectedProvince);
      const city = province?.cities.find(c => c.name === selectedCity);
      
      if (!city) {
        throw new Error('شہر نہیں ملا');
      }

      // Using method=2 (University of Islamic Sciences, Karachi) with Hanafi school
      const times = await fetchPrayerTimes(city.latitude, city.longitude);
      setPrayerTimes(times);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'اوقات حاصل کرنے میں خرابی ہوئی');
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
    { english: 'Fajr', urdu: 'فجر', emoji: '🌅' },
    { english: 'Dhuhr', urdu: 'ظہر', emoji: '☀️' },
    { english: 'Asr', urdu: 'عصر', emoji: '🌇' },
    { english: 'Maghrib', urdu: 'مغرب', emoji: '🌆' },
    { english: 'Isha', urdu: 'عشاء', emoji: '🌙' }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        
        {/* Header */}
        <header className="text-center mb-8 bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-2 jameel-font">
            اوقات نماز پاکستان
          </h1>
          <p className="text-gray-600 text-lg jameel-font">
            جامعہ اسلامک سائنسز کراچی کے حنفی طریقہ کے مطابق
          </p>
          <p className="text-sm text-gray-500 mt-2">
            University of Islamic Sciences, Karachi - Hanafi Method
          </p>
        </header>

        {/* Current Time */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 text-center">
          <div className="text-2xl font-bold text-emerald-700 mb-1">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit',
              hour12: true 
            })}
          </div>
          <div className="text-gray-600 jameel-font">
            {currentTime.toLocaleDateString('ur-PK', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* City Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 jameel-font flex items-center">
            <MapPin className="w-5 h-5 ml-2 text-emerald-600" />
            شہر منتخب کریں
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Province Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 jameel-font">
                صوبہ
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 jameel-font"
              >
                {provinces.map((province) => (
                  <option key={province.name} value={province.name}>
                    {province.nameUrdu}
                  </option>
                ))}
              </select>
            </div>

            {/* City Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 jameel-font">
                شہر
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={loading || !selectedProvince}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 jameel-font"
              >
                {currentProvince?.cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.nameUrdu}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-4 text-center">
            <button
              onClick={getPrayerTimes}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center space-x-reverse space-x-2 mx-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="jameel-font">اوقات تازہ کریں</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <RefreshCw className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-lg text-gray-700 jameel-font">اوقات لوڈ ہو رہے ہیں...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-center jameel-font">{error}</p>
          </div>
        )}

        {/* Prayer Times Display */}
        {prayerTimes && !loading && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 jameel-font">
                {currentCity?.nameUrdu} کے نماز کے اوقات
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {prayerNames.map((prayer, index) => {
                  const time = prayerTimes.data.timings[prayer.english as keyof typeof prayerTimes.data.timings];
                  return (
                    <div
                      key={prayer.english}
                      className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      {/* Prayer Icon and Emoji */}
                      <div className="flex items-center justify-center mb-3">
                        {getPrayerIcon(prayer.english)}
                        <span className="text-2xl ml-2">{prayer.emoji}</span>
                      </div>
                      
                      {/* Prayer Name */}
                      <h3 className="font-bold text-gray-800 jameel-font text-lg mb-2">
                        {prayer.urdu}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {prayer.english}
                      </p>
                      
                      {/* Prayer Time */}
                      <div className="bg-white rounded-md p-3 border">
                        <p className="text-xl font-bold text-emerald-700">
                          {formatTime(time)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div>
                  <h4 className="font-semibold text-gray-800 jameel-font mb-2">
                    عیسوی تاریخ
                  </h4>
                  <p className="text-gray-700 jameel-font">
                    {prayerTimes.data.date.readable}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 jameel-font mb-2">
                    ہجری تاریخ
                  </h4>
                  <p className="text-gray-700 jameel-font">
                    {prayerTimes.data.date.hijri.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Important Information */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center mb-4">
            <Info className="w-5 h-5 text-blue-600 ml-2" />
            <h3 className="text-lg font-semibold text-blue-800 jameel-font">اہم معلومات</h3>
          </div>
          <div className="space-y-2 text-sm text-blue-700 jameel-font leading-relaxed">
            <p>• یہ اوقات جامعہ اسلامک سائنسز کراچی کے حنفی طریقہ کار کے مطابق ہیں۔</p>
            <p>• حنفی فقہ میں عصر اور عشاء کا وقت دیگر مذاہب سے مختلف ہے۔</p>
            <p>• نماز کے اوقات میں معمولی فرق ہو سکتا ہے جو مقام اور موسمی حالات پر منحصر ہے۔</p>
            <p>• برائے کرم اپنے مقامی مسجد سے بھی اوقات کی تصدیق کریں۔</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p className="jameel-font">© 2025 اوقات نماز پاکستان - تمام حقوق محفوظ ہیں</p>
          <p className="mt-1">Prayer Times Pakistan - All Rights Reserved</p>
        </footer>
      </div>
    </div>
  );
}

export default App;