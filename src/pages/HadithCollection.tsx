import React, { useState, useEffect } from 'react';
import { BookMarked, RefreshCw, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Hadith {
  id: number;
  hadithArabic: string;
  hadithUrdu: string;
  hadithEnglish: string;
  bookName: string;
  chapterName: string;
  hadithNumber: string;
}

// Sample Hadith collection (Sahih Bukhari & Muslim)
const hadithDatabase: Hadith[] = [
  {
    id: 1,
    hadithArabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    hadithUrdu: 'بے شک اعمال کا دارومدار نیتوں پر ہے اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی',
    hadithEnglish: 'Actions are judged by intentions, and everyone will get what they intended.',
    bookName: 'Sahih Bukhari',
    chapterName: 'Book of Revelation',
    hadithNumber: '1'
  },
  {
    id: 2,
    hadithArabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    hadithUrdu: 'جو شخص اللہ اور آخرت پر ایمان رکھتا ہے وہ اچھی بات کہے یا خاموش رہے',
    hadithEnglish: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    bookName: 'Sahih Bukhari',
    chapterName: 'Book of Faith',
    hadithNumber: '31'
  },
  {
    id: 3,
    hadithArabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ',
    hadithUrdu: 'جو شخص اللہ اور آخرت پر ایمان رکھتا ہے وہ اپنے مہمان کی عزت کرے',
    hadithEnglish: 'Whoever believes in Allah and the Last Day should honor his guest.',
    bookName: 'Sahih Bukhari',
    chapterName: 'Book of Manners',
    hadithNumber: '85'
  },
  {
    id: 4,
    hadithArabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    hadithUrdu: 'مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں',
    hadithEnglish: 'A Muslim is one from whose tongue and hand other Muslims are safe.',
    bookName: 'Sahih Bukhari',
    chapterName: 'Book of Faith',
    hadithNumber: '10'
  },
  {
    id: 5,
    hadithArabic: 'الدِّينُ النَّصِيحَةُ',
    hadithUrdu: 'دین خیرخواہی کا نام ہے',
    hadithEnglish: 'Religion is sincere advice.',
    bookName: 'Sahih Muslim',
    chapterName: 'Book of Faith',
    hadithNumber: '55'
  },
  {
    id: 6,
    hadithArabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ',
    hadithUrdu: 'اپنے بھائی کے چہرے پر مسکرانا صدقہ ہے',
    hadithEnglish: 'Your smile in the face of your brother is charity.',
    bookName: 'Tirmidhi',
    chapterName: 'Book of Virtues',
    hadithNumber: '1956'
  },
  {
    id: 7,
    hadithArabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    hadithUrdu: 'تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے',
    hadithEnglish: 'The best among you are those who learn the Quran and teach it.',
    bookName: 'Sahih Bukhari',
    chapterName: 'Book of Virtues of the Quran',
    hadithNumber: '5027'
  },
  {
    id: 8,
    hadithArabic: 'مَنْ صَلَّى الْفَجْرَ فَهُوَ فِي ذِمَّةِ اللَّهِ',
    hadithUrdu: 'جس نے فجر کی نماز پڑھی وہ اللہ کی حفاظت میں ہے',
    hadithEnglish: 'Whoever prays Fajr is under the protection of Allah.',
    bookName: 'Sahih Muslim',
    chapterName: 'Book of Prayer',
    hadithNumber: '657'
  },
  {
    id: 9,
    hadithArabic: 'الطَّهُورُ شَطْرُ الإِيمَانِ',
    hadithUrdu: 'پاکیزگی آدھا ایمان ہے',
    hadithEnglish: 'Cleanliness is half of faith.',
    bookName: 'Sahih Muslim',
    chapterName: 'Book of Purification',
    hadithNumber: '223'
  },
  {
    id: 10,
    hadithArabic: 'مَنْ غَشَّنَا فَلَيْسَ مِنَّا',
    hadithUrdu: 'جس نے ہمیں دھوکہ دیا وہ ہم میں سے نہیں',
    hadithEnglish: 'Whoever deceives us is not one of us.',
    bookName: 'Sahih Muslim',
    chapterName: 'Book of Faith',
    hadithNumber: '102'
  },
  {
    id: 11,
    hadithArabic: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ',
    hadithUrdu: 'طاقتور مومن کمزور مومن سے بہتر ہے اور اللہ کو زیادہ محبوب ہے',
    hadithEnglish: 'A strong believer is better and more beloved to Allah than a weak believer.',
    bookName: 'Sahih Muslim',
    chapterName: 'Book of Destiny',
    hadithNumber: '2664'
  },
  {
    id: 12,
    hadithArabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    hadithUrdu: 'تم میں سے کوئی اس وقت تک مومن نہیں جب تک اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے',
    hadithEnglish: 'None of you believes until he loves for his brother what he loves for himself.',
    bookName: 'Sahih Bukhari',
    chapterName: 'Book of Faith',
    hadithNumber: '13'
  },
  {
    id: 13,
    hadithArabic: 'الْمُسْلِمُ أَخُو الْمُسْلِمِ لَا يَظْلِمُهُ وَلَا يُسْلِمُهُ',
    hadithUrdu: 'مسلمان مسلمان کا بھائی ہے، نہ اس پر ظلم کرے اور نہ اسے تنہا چھوڑے',
    hadithEnglish: 'A Muslim is a brother to another Muslim; he does not wrong him nor abandon him.',
    bookName: 'Sahih Bukhari',
    chapterName: 'Book of Oppression',
    hadithNumber: '2442'
  },
  {
    id: 14,
    hadithArabic: 'مَنْ بَنَى مَسْجِدًا يَبْتَغِي بِهِ وَجْهَ اللَّهِ بَنَى اللَّهُ لَهُ مِثْلَهُ فِي الْجَنَّةِ',
    hadithUrdu: 'جس نے اللہ کی رضا کے لیے مسجد بنائی اللہ اس کے لیے جنت میں ایسا ہی گھر بناتا ہے',
    hadithEnglish: 'Whoever builds a mosque for Allah, Allah builds for him a house in Paradise.',
    bookName: 'Sahih Bukhari',
    chapterName: 'Book of Prayer',
    hadithNumber: '450'
  },
  {
    id: 15,
    hadithArabic: 'مَنْ قَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    hadithUrdu: 'جس نے ایمان اور ثواب کی نیت سے رمضان میں قیام کیا اس کے پچھلے گناہ معاف ہو جاتے ہیں',
    hadithEnglish: 'Whoever stands (in prayer) in Ramadan with faith and seeking reward, his past sins are forgiven.',
    bookName: 'Sahih Bukhari',
    chapterName: 'Book of Taraweeh',
    hadithNumber: '2009'
  }
];

export default function HadithCollection({ darkMode, language }: { darkMode: boolean; language: 'ur' | 'en' }) {
  const [currentHadith, setCurrentHadith] = useState<Hadith>(hadithDatabase[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const isEnglish = language === 'en';
  const dir = isEnglish ? 'ltr' : 'rtl';

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favoriteHadiths');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteHadiths', JSON.stringify(favorites));
  }, [favorites]);

  // Get daily hadith based on date
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const dailyIndex = dayOfYear % hadithDatabase.length;
    setCurrentHadith(hadithDatabase[dailyIndex]);
    setCurrentIndex(dailyIndex);
  }, []);

  const getRandomHadith = () => {
    const randomIndex = Math.floor(Math.random() * hadithDatabase.length);
    setCurrentHadith(hadithDatabase[randomIndex]);
    setCurrentIndex(randomIndex);
  };

  const goToNext = () => {
    const hadiths = showFavoritesOnly
      ? hadithDatabase.filter(h => favorites.includes(h.id))
      : hadithDatabase;

    if (hadiths.length === 0) return;

    const nextIndex = (currentIndex + 1) % hadiths.length;
    setCurrentIndex(nextIndex);
    setCurrentHadith(hadiths[nextIndex]);
  };

  const goToPrevious = () => {
    const hadiths = showFavoritesOnly
      ? hadithDatabase.filter(h => favorites.includes(h.id))
      : hadithDatabase;

    if (hadiths.length === 0) return;

    const prevIndex = currentIndex === 0 ? hadiths.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentHadith(hadiths[prevIndex]);
  };

  const toggleFavorite = () => {
    if (favorites.includes(currentHadith.id)) {
      setFavorites(favorites.filter(id => id !== currentHadith.id));
    } else {
      setFavorites([...favorites, currentHadith.id]);
    }
  };

  const isFavorite = favorites.includes(currentHadith.id);
  const favoriteHadiths = hadithDatabase.filter(h => favorites.includes(h.id));

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="card mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <BookMarked className={`w-8 h-8 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} dir={dir}>
            {isEnglish ? 'Hadith Collection' : 'احادیث کا مجموعہ'}
          </h1>
        </div>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} dir={dir}>
          {isEnglish ? 'Daily authentic Hadiths from Sahih collections' : 'صحیح احادیث کا روزانہ مجموعہ'}
        </p>
      </div>

      {/* Controls */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={getRandomHadith}
            className={`chip-soft flex items-center gap-2 hover:scale-105 transition-transform ${
              darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            {isEnglish ? 'Random Hadith' : 'بے ترتیب حدیث'}
          </button>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`chip-soft flex items-center gap-2 hover:scale-105 transition-transform ${
              showFavoritesOnly
                ? darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                : darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            {isEnglish
              ? `Favorites (${favorites.length})`
              : `پسندیدہ (${favorites.length})`}
          </button>
        </div>
      </div>

      {/* Hadith Display */}
      {showFavoritesOnly && favoriteHadiths.length === 0 ? (
        <div className="card text-center py-12">
          <Star className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} dir={dir}>
            {isEnglish ? 'No favorite Hadiths yet' : 'ابھی تک کوئی پسندیدہ حدیث نہیں'}
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`} dir={dir}>
            {isEnglish ? 'Mark Hadiths as favorite to save them here' : 'احادیث کو پسندیدہ کے طور پر نشان زد کریں'}
          </p>
        </div>
      ) : (
        <div className="card">
          {/* Hadith Number & Book Info */}
          <div className="flex items-center justify-between mb-4">
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} dir={dir}>
              <p className="font-semibold">{currentHadith.bookName}</p>
              <p className="text-xs">{currentHadith.chapterName} - #{currentHadith.hadithNumber}</p>
            </div>

            <button
              onClick={toggleFavorite}
              className={`icon-button p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                isFavorite
                  ? darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                  : ''
              }`}
              title={isEnglish ? 'Add to Favorites' : 'پسندیدہ میں شامل کریں'}
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Arabic Text */}
          <div className="mb-6">
            <p className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`} dir={dir}>
              {isEnglish ? 'Arabic:' : 'عربی:'}
            </p>
            <p
              className={`text-2xl leading-relaxed ${darkMode ? 'text-white' : 'text-gray-900'}`}
              dir="rtl"
              style={{ fontFamily: 'Traditional Arabic, serif' }}
            >
              {currentHadith.hadithArabic}
            </p>
          </div>

          {/* Urdu Translation */}
          <div className={`mb-6 pt-6 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`} dir={dir}>
              {isEnglish ? 'Urdu Translation:' : 'اردو ترجمہ:'}
            </p>
            <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} dir="rtl">
              {currentHadith.hadithUrdu}
            </p>
          </div>

          {/* English Translation */}
          <div className={`pt-6 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`} dir={dir}>
              {isEnglish ? 'English Translation:' : 'انگریزی ترجمہ:'}
            </p>
            <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentHadith.hadithEnglish}
            </p>
          </div>

          {/* Navigation */}
          <div className={`flex items-center justify-between mt-6 pt-6 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <button
              onClick={goToPrevious}
              className="chip-soft flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <ChevronLeft className="w-4 h-4" />
              {isEnglish ? 'Previous' : 'پچھلا'}
            </button>

            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {showFavoritesOnly
                ? isEnglish
                  ? `${currentIndex + 1} of ${favoriteHadiths.length}`
                  : `${currentIndex + 1} از ${favoriteHadiths.length}`
                : isEnglish
                  ? `${currentIndex + 1} of ${hadithDatabase.length}`
                  : `${currentIndex + 1} از ${hadithDatabase.length}`
              }
            </span>

            <button
              onClick={goToNext}
              className="chip-soft flex items-center gap-2 hover:scale-105 transition-transform"
            >
              {isEnglish ? 'Next' : 'اگلا'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className={`card mt-6 ${darkMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
        <p className={`text-sm ${darkMode ? 'text-amber-400' : 'text-amber-800'}`} dir={dir}>
          <strong>{isEnglish ? 'Daily Hadith:' : 'آج کی حدیث:'}</strong> {isEnglish
            ? 'A new Hadith is automatically selected every day based on the date.'
            : 'ہر روز تاریخ کی بنیاد پر ایک نئی حدیث خودکار طور پر منتخب ہوتی ہے۔'}
        </p>
      </div>
    </div>
  );
}
