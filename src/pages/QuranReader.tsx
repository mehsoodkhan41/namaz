import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Search, Loader } from 'lucide-react';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  textUrdu?: string;
  surah: {
    number: number;
    name: string;
  };
}

export default function QuranReader({ darkMode, language }: { darkMode: boolean; language: 'ur' | 'en' }) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [ayahsUrdu, setAyahsUrdu] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ayahsPerPage = 10;

  const isEnglish = language === 'en';
  const dir = isEnglish ? 'ltr' : 'rtl';

  // Fetch list of surahs
  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          setSurahs(data.data);
        }
      })
      .catch(err => console.error('Error fetching surahs:', err));
  }, []);

  // Fetch ayahs when a surah is selected
  useEffect(() => {
    if (selectedSurah) {
      setLoading(true);
      setCurrentPage(1);

      // Fetch Arabic text
      fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}`)
        .then(res => res.json())
        .then(data => {
          if (data.code === 200) {
            setAyahs(data.data.ayahs);
          }
        })
        .catch(err => console.error('Error fetching ayahs:', err));

      // Fetch Urdu translation
      fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/ur.ahmedali`)
        .then(res => res.json())
        .then(data => {
          if (data.code === 200) {
            setAyahsUrdu(data.data.ayahs);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching Urdu translation:', err);
          setLoading(false);
        });
    }
  }, [selectedSurah]);

  const filteredSurahs = surahs.filter(surah =>
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.name.includes(searchTerm) ||
    surah.number.toString().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastAyah = currentPage * ayahsPerPage;
  const indexOfFirstAyah = indexOfLastAyah - ayahsPerPage;
  const currentAyahs = ayahs.slice(indexOfFirstAyah, indexOfLastAyah);
  const totalPages = Math.ceil(ayahs.length / ayahsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="card mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <BookOpen className={`w-8 h-8 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} dir={dir}>
            {isEnglish ? 'Quran Reader' : 'قرآن مجید'}
          </h1>
        </div>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} dir={dir}>
          {isEnglish ? 'Read the Holy Quran with Urdu translation' : 'قرآن مجید اردو ترجمہ کے ساتھ پڑھیں'}
        </p>
      </div>

      {!selectedSurah ? (
        <>
          {/* Search Bar */}
          <div className="card mb-6">
            <div className="relative">
              <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder={isEnglish ? 'Search Surah...' : 'سورۃ تلاش کریں...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 rounded-xl ${
                  darkMode
                    ? 'bg-slate-800/50 text-white border-slate-700'
                    : 'bg-white text-gray-900 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                dir={dir}
              />
            </div>
          </div>

          {/* Surah List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurahs.map((surah) => (
              <button
                key={surah.number}
                onClick={() => setSelectedSurah(surah.number)}
                className={`card hover:scale-105 transition-all duration-300 text-${dir === 'rtl' ? 'right' : 'left'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                    darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {surah.number}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`} dir="rtl">
                      {surah.name}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {surah.englishName} - {surah.numberOfAyahs} {isEnglish ? 'verses' : 'آیات'}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {surah.englishNameTranslation}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Back Button & Surah Info */}
          <div className="card mb-6">
            <button
              onClick={() => {
                setSelectedSurah(null);
                setAyahs([]);
                setAyahsUrdu([]);
                setCurrentPage(1);
              }}
              className={`chip-soft mb-4 inline-flex items-center gap-2 ${
                darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {isEnglish ? 'Back to Surahs' : 'سورتوں کی فہرست'}
            </button>

            {surahs.find(s => s.number === selectedSurah) && (
              <div className="text-center" dir={dir}>
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} dir="rtl">
                  {surahs.find(s => s.number === selectedSurah)?.name}
                </h2>
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {surahs.find(s => s.number === selectedSurah)?.englishName}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {surahs.find(s => s.number === selectedSurah)?.englishNameTranslation}
                </p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader className={`w-8 h-8 animate-spin ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
          )}

          {/* Ayahs Display */}
          {!loading && currentAyahs.length > 0 && (
            <div className="space-y-4">
              {currentAyahs.map((ayah, index) => {
                const urduAyah = ayahsUrdu.find(a => a.numberInSurah === ayah.numberInSurah);
                return (
                  <div key={ayah.number} className="card">
                    {/* Ayah Number Badge */}
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-3 ${
                      darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <span className="text-sm font-bold">{ayah.numberInSurah}</span>
                    </div>

                    {/* Arabic Text */}
                    <p className={`text-2xl leading-relaxed mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`} dir="rtl" style={{ fontFamily: 'Traditional Arabic, serif' }}>
                      {ayah.text}
                    </p>

                    {/* Urdu Translation */}
                    {urduAyah && (
                      <div className={`pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                        <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} dir="rtl">
                          {urduAyah.text}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="card flex items-center justify-between">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`chip-soft flex items-center gap-2 ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {isEnglish ? 'Previous' : 'پچھلا'}
                  </button>

                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isEnglish ? `Page ${currentPage} of ${totalPages}` : `صفحہ ${currentPage} از ${totalPages}`}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`chip-soft flex items-center gap-2 ${
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                  >
                    {isEnglish ? 'Next' : 'اگلا'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
