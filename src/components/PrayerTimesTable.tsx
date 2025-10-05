import React from 'react';
import { Clock, Sunrise, Sun, Sunset, Moon, Star, MapPin, Calendar } from 'lucide-react';
import { PrayerTime } from '../services/prayerTimesApi';

interface PrayerTimesTableProps {
  prayerTimes: PrayerTime[];
  isLoading: boolean;
  error: string | null;
  cityName: string;
  date: string;
  hijriDate: string;
  prayerTimesResponse?: any;
}

const PrayerTimesTable: React.FC<PrayerTimesTableProps> = ({
  prayerTimes,
  isLoading,
  error,
  cityName,
  date,
  hijriDate
  prayerTimesResponse
}) => {
  // If we have the response object, extract prayer times from it
  React.useEffect(() => {
    if (prayerTimesResponse && prayerTimesResponse.data) {
      const timings = prayerTimesResponse.data.timings;
      const extractedPrayerTimes: PrayerTime[] = [
        {
          name: 'Fajr',
          nameUrdu: 'فجر',
          time: formatTime(timings.Fajr),
          timestamp: parseTime(timings.Fajr).getTime()
        },
        {
          name: 'Sunrise',
          nameUrdu: 'طلوع آفتاب',
          time: formatTime(timings.Sunrise),
          timestamp: parseTime(timings.Sunrise).getTime()
        },
        {
          name: 'Dhuhr',
          nameUrdu: 'ظہر',
          time: formatTime(timings.Dhuhr),
          timestamp: parseTime(timings.Dhuhr).getTime()
        },
        {
          name: 'Asr',
          nameUrdu: 'عصر',
          time: formatTime(timings.Asr),
          timestamp: parseTime(timings.Asr).getTime()
        },
        {
          name: 'Maghrib',
          nameUrdu: 'مغرب',
          time: formatTime(timings.Maghrib),
          timestamp: parseTime(timings.Maghrib).getTime()
        },
        {
          name: 'Isha',
          nameUrdu: 'عشاء',
          time: formatTime(timings.Isha),
          timestamp: parseTime(timings.Isha).getTime()
        }
      ];
      // You might want to update the parent component's state here
    }
  }, [prayerTimesResponse]);

  const getPrayerIcon = (prayerName: string) => {
    const iconProps = { className: "h-8 w-8" };
    switch (prayerName) {
      case 'Fajr':
        return <Sunrise {...iconProps} className="h-8 w-8 text-blue-400" />;
      case 'Sunrise':
        return <Sun {...iconProps} className="h-8 w-8 text-yellow-400" />;
      case 'Dhuhr':
        return <Sun {...iconProps} className="h-8 w-8 text-orange-400" />;
      case 'Asr':
        return <Sun {...iconProps} className="h-8 w-8 text-orange-600" />;
      case 'Maghrib':
        return <Sunset {...iconProps} className="h-8 w-8 text-red-400" />;
      case 'Isha':
        return <Moon {...iconProps} className="h-8 w-8 text-indigo-400" />;
      default:
        return <Clock {...iconProps} />;
    }
  };

  const getPrayerGradient = (prayerName: string) => {
    switch (prayerName) {
      case 'Fajr':
        return 'from-blue-500 to-indigo-600';
      case 'Sunrise':
        return 'from-yellow-400 to-orange-500';
      case 'Dhuhr':
        return 'from-orange-400 to-red-500';
      case 'Asr':
        return 'from-orange-600 to-red-600';
      case 'Maghrib':
        return 'from-red-500 to-pink-600';
      case 'Isha':
        return 'from-indigo-600 to-purple-700';
      default:
        return 'from-emerald-500 to-emerald-600';
    }
  };

  if (isLoading) {
    return (
      <div className="glass-effect rounded-3xl shadow-premium p-8 slide-in-up" dir="rtl">
        <div className="animate-pulse">
          <div className="h-10 loading-shimmer rounded-xl w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-shimmer rounded-2xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-effect rounded-3xl shadow-premium p-8 slide-in-up" dir="rtl">
        <div className="text-center py-12">
          <div className="text-red-500 mb-6">
            <Clock className="h-20 w-20 mx-auto animate-pulse" />
          </div>
          <h3 className="text-2xl font-semibold text-red-700 mb-4 jameel-font">
            نماز کے اوقات لوڈ کرنے میں خرابی
          </h3>
          <p className="text-red-600 jameel-font text-lg">{error}</p>
          <p className="text-gray-500 text-sm mt-4 jameel-font">
            براہ کرم اپنا انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں
          </p>
        </div>
      </div>
    );
  }

  if (!prayerTimes.length) {
    return (
      <div className="glass-effect rounded-3xl shadow-premium p-8 slide-in-up" dir="rtl">
        <div className="text-center py-12">
          <Clock className="h-20 w-20 mx-auto text-gray-400 mb-8 float-animation" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 jameel-font">
            نماز کے اوقات دستیاب نہیں
          </h3>
          <p className="text-gray-500 jameel-font text-lg">
            براہ کرم صوبہ اور شہر منتخب کریں
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="slide-in-up" dir="rtl">
      {/* Header Section */}
      <div className="glass-effect rounded-3xl shadow-premium p-8 mb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 text-emerald-600 ml-3 glow-effect" />
            <h2 className="text-4xl font-bold text-gray-800 jameel-font bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              {cityName} کے نماز کے اوقات
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-reverse sm:space-x-8 space-y-2 sm:space-y-0">
            <div className="flex items-center justify-center">
              <Calendar className="h-5 w-5 text-emerald-600 ml-2" />
              <p className="jameel-font text-gray-700 text-lg">{date}</p>
            </div>
            <div className="flex items-center justify-center">
              <Star className="h-5 w-5 text-emerald-600 ml-2" />
              <p className="jameel-font text-gray-700 text-lg">{hijriDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prayer Times Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {prayerTimes.map((prayer, index) => (
          <div
            key={index}
            className="prayer-card-premium shadow-divine p-8 fade-in-scale"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Prayer Icon and Name */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-reverse space-x-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${getPrayerGradient(prayer.name)} shadow-golden islamic-glow`}>
                  {getPrayerIcon(prayer.name)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 jameel-font text-3xl mb-2">
                    {prayer.nameUrdu}
                  </h3>
                  <p className="text-base text-gray-600 english-font font-semibold">
                    {prayer.name}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Prayer Time */}
            <div className="text-center">
              <div className={`inline-block px-8 py-6 rounded-2xl bg-gradient-to-r ${getPrayerGradient(prayer.name)} shadow-golden islamic-glow`}>
                <p className="text-4xl font-bold text-white jameel-font drop-shadow-lg">
                  {prayer.time}
                </p>
              </div>
            </div>
            
            {/* Decorative Bottom */}
            <div className="mt-6 flex justify-center">
              <div className={`w-20 h-2 bg-gradient-to-r ${getPrayerGradient(prayer.name)} rounded-full islamic-glow`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Hanafi Information */}
      <div className="glass-effect rounded-3xl shadow-premium p-8 border border-blue-200">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-blue-600 ml-3 glow-effect" />
            <h4 className="font-bold text-blue-800 jameel-font text-2xl">
              حنفی فقہ کی خصوصیات
            </h4>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h5 className="font-semibold text-blue-800 jameel-font text-xl mb-4">
              عصر کی نماز میں فرق
            </h5>
            <p className="text-blue-700 jameel-font leading-relaxed">
              حنفی فقہ کے مطابق عصر کی نماز کا وقت اس وقت شروع ہوتا ہے جب کسی چیز کا سایہ اس کی اصل لمبائی کے دوگنا ہو جائے، 
              جبکہ شافعی فقہ میں یہ وقت اس وقت شروع ہوتا ہے جب سایہ اصل لمبائی کے برابر ہو جائے۔
            </p>
          </div>
          
          <div className="glass-dark rounded-2xl p-6">
            <h5 className="font-semibold text-blue-800 jameel-font text-xl mb-4">
              جامعہ اسلامیہ کراچی کا طریقہ
            </h5>
            <div className="space-y-3 text-sm jameel-font">
              <div className="flex justify-between items-center">
                <span className="text-blue-700">فجر کا زاویہ</span>
                <span className="text-blue-600 font-bold">18°</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">عشاء کا زاویہ</span>
                <span className="text-blue-600 font-bold">18°</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">عصر کا طریقہ</span>
                <span className="text-blue-600 font-bold">حنفی</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesTable;