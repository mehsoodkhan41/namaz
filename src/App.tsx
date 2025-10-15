import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Info, Settings as SettingsIcon, Menu, X, Sun, Moon, Bell, BellOff, Plus, Navigation as NavigationIcon, MapPin, BookOpen, BookMarked } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Settings from './pages/Settings';
import QuranReader from './pages/QuranReader';
import HadithCollection from './pages/HadithCollection';

function NavBar({ darkMode, setDarkMode, notificationsEnabled, setNotificationsEnabled, onTasbihClick, onQiblaClick, onDuasClick, onLocationClick, language }: {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  onTasbihClick?: () => void;
  onQiblaClick?: () => void;
  onDuasClick?: () => void;
  onLocationClick?: () => void;
  language: 'ur' | 'en';
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isEnglish = language === 'en';
  const dir = isEnglish ? 'ltr' : 'rtl';

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'ہوم', labelEn: 'Home' },
    { path: '/quran', icon: BookOpen, label: 'قرآن', labelEn: 'Quran' },
    { path: '/hadith', icon: BookMarked, label: 'حدیث', labelEn: 'Hadith' },
    { path: '/about', icon: Info, label: 'تعارف', labelEn: 'About' },
    { path: '/settings', icon: SettingsIcon, label: 'ترتیبات', labelEn: 'Settings' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
      } else {
        setNotificationsEnabled(false);
        window.alert(isEnglish ? 'Please allow notifications in your browser settings.' : 'براہ کرم اپنے براؤزر میں نوٹیفکیشن کی اجازت دیں۔');
      }
    } else {
      setNotificationsEnabled(true);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar-surface fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
              <div className={`text-2xl font-bold drop-shadow-md ${darkMode ? 'text-white' : 'text-gray-900'}`} dir={dir}>
                {isEnglish ? 'Prayer Times' : 'اوقات نماز'}
              </div>
              <span className={`hidden sm:block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} dir={dir}>
                {isEnglish ? 'Schedule & Tools' : 'شیڈول اور مددگار فیچرز'}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Page Links */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${active ? 'navbar-link navbar-link-active shadow-lg' : 'navbar-link'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-semibold" dir={language === 'en' ? 'ltr' : 'rtl'}>{language === 'en' ? item.labelEn : item.label}</span>
                  </Link>
                );
              })}

              {/* Divider */}
              <div className={`h-8 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} mx-2`}></div>

              {/* Feature Buttons */}
              {location.pathname === '/' && (
                <>
                  <button
                    onClick={onTasbihClick}
                    className="icon-button p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                    data-variant="emerald"
                    title={language === 'en' ? 'Tasbih' : 'تسبیح'}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onQiblaClick}
                    className="icon-button p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                    data-variant="amber"
                    title={language === 'en' ? 'Qibla' : 'قبلہ'}
                  >
                    <NavigationIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onDuasClick}
                    className="icon-button p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                    data-variant="violet"
                    title={language === 'en' ? 'Duas' : 'دعائیں'}
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onLocationClick}
                    className="icon-button p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                    data-variant="sky"
                    title={language === 'en' ? 'GPS Location' : 'GPS مقام'}
                  >
                    <MapPin className="w-5 h-5" />
                  </button>

                  {/* Divider */}
                  <div className={`h-8 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} mx-2`}></div>
                </>
              )}

              {/* Dark Mode & Notifications */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="icon-button p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                title={language === 'en' ? (darkMode ? 'Light Mode' : 'Dark Mode') : (darkMode ? 'لائٹ موڈ' : 'ڈارک موڈ')}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => {
                  if (notificationsEnabled) {
                    setNotificationsEnabled(false);
                  } else {
                    requestNotificationPermission();
                  }
                }}
                className="icon-button p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                title={language === 'en' ? (notificationsEnabled ? 'Notifications On' : 'Notifications Off') : (notificationsEnabled ? 'نوٹیفکیشنز آن' : 'نوٹیفکیشنز آف')}
              >
                {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden icon-button p-2 rounded-xl transition-all duration-300 hover:scale-110"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-emerald-100/60 bg-white/95 dark:border-slate-800/80 dark:bg-slate-950/95">
            <div className="px-4 py-3 space-y-1">
              {/* Page Links */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'navbar-link navbar-link-active shadow-md' : 'navbar-link'}`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <p className="font-semibold" dir={language === 'en' ? 'ltr' : 'rtl'}>{language === 'en' ? item.labelEn : item.label}</p>
                      <p className="text-xs opacity-75">{language === 'en' ? item.label : item.labelEn}</p>
                    </div>
                  </Link>
                );
              })}

              {/* Feature Buttons (Mobile) */}
              {location.pathname === '/' && (
                <>
                  <div className="my-2 border-t border-emerald-100/60 dark:border-white/10"></div>
                  <button
                    onClick={() => { onTasbihClick?.(); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all chip-soft hover:translate-x-1"
                    data-variant="emerald"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold" dir={language === 'en' ? 'ltr' : 'rtl'}>{language === 'en' ? 'Tasbih' : 'تسبیح'}</span>
                  </button>
                  <button
                    onClick={() => { onQiblaClick?.(); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all chip-soft hover:translate-x-1"
                    data-variant="amber"
                  >
                    <NavigationIcon className="w-5 h-5" />
                    <span className="font-semibold" dir={language === 'en' ? 'ltr' : 'rtl'}>{language === 'en' ? 'Qibla' : 'قبلہ'}</span>
                  </button>
                  <button
                    onClick={() => { onDuasClick?.(); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all chip-soft hover:translate-x-1"
                    data-variant="violet"
                  >
                    <Info className="w-5 h-5" />
                    <span className="font-semibold" dir={language === 'en' ? 'ltr' : 'rtl'}>{language === 'en' ? 'Duas' : 'دعائیں'}</span>
                  </button>
                  <button
                    onClick={() => { onLocationClick?.(); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all chip-soft hover:translate-x-1"
                    data-variant="sky"
                  >
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold" dir={language === 'en' ? 'ltr' : 'rtl'}>{language === 'en' ? 'GPS Location' : 'GPS مقام'}</span>
                  </button>
                </>
              )}

              {/* Settings */}
              <div className="my-2 border-t border-emerald-100/60 dark:border-white/10"></div>
              <button
                onClick={() => { setDarkMode(!darkMode); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all chip-soft hover:translate-x-1"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span className="font-semibold" dir={language === 'en' ? 'ltr' : 'rtl'}>{language === 'en' ? (darkMode ? 'Light Mode' : 'Dark Mode') : (darkMode ? 'لائٹ موڈ' : 'ڈارک موڈ')}</span>
              </button>
              <button
                onClick={() => {
                  if (notificationsEnabled) {
                    setNotificationsEnabled(false);
                  } else {
                    requestNotificationPermission();
                  }
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all chip-soft hover:translate-x-1"
              >
                {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                <span className="font-semibold" dir={language === 'en' ? 'ltr' : 'rtl'}>{language === 'en' ? (notificationsEnabled ? 'Notifications On' : 'Notifications Off') : (notificationsEnabled ? 'نوٹیفکیشنز آن' : 'نوٹیفکیشنز آف')}</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-40 mt-16"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const [language, setLanguage] = useState<'ur' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('language');
      return stored === 'en' ? 'en' : 'ur';
    }
    return 'ur';
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('notificationsEnabled') === 'true';
    }
    return false;
  });
  const [azanSound, setAzanSound] = useState(() => {
    return localStorage.getItem('azanSound') || 'classic';
  });

  // Feature toggle states (lifted from Home)
  const [showTasbih, setShowTasbih] = useState(false);
  const [showQibla, setShowQibla] = useState(false);
  const [showDuas, setShowDuas] = useState(false);

  // Store ref to detectLocation function from Home
  const detectLocationRef = React.useRef<(() => void) | null>(null);

  // Save dark mode preference
  React.useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  React.useEffect(() => {
    localStorage.setItem('azanSound', azanSound);
  }, [azanSound]);

  useEffect(() => {
    window.localStorage.setItem('notificationsEnabled', notificationsEnabled ? 'true' : 'false');
  }, [notificationsEnabled]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'en' ? 'ltr' : 'rtl');
    document.documentElement.setAttribute('lang', language === 'en' ? 'en' : 'ur');
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem('language', language);
  }, [language]);

  return (
    <div className="min-h-screen transition-colors duration-500 relative">
      <NavBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
        onTasbihClick={() => setShowTasbih(true)}
        onQiblaClick={() => setShowQibla(true)}
        onDuasClick={() => setShowDuas(true)}
        onLocationClick={() => detectLocationRef.current?.()}
        language={language}
      />

      {/* Main Content with top padding for navbar */}
      <div className="pt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} notificationsEnabled={notificationsEnabled} setNotificationsEnabled={setNotificationsEnabled} azanSound={azanSound} language={language} showTasbih={showTasbih} setShowTasbih={setShowTasbih} showQibla={showQibla} setShowQibla={setShowQibla} showDuas={showDuas} setShowDuas={setShowDuas} registerDetectLocation={(fn) => { detectLocationRef.current = fn; }} />} />
            <Route path="/quran" element={<QuranReader darkMode={darkMode} language={language} />} />
            <Route path="/hadith" element={<HadithCollection darkMode={darkMode} language={language} />} />
            <Route path="/about" element={<About darkMode={darkMode} language={language} />} />
            <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} notificationsEnabled={notificationsEnabled} setNotificationsEnabled={setNotificationsEnabled} azanSound={azanSound} setAzanSound={setAzanSound} language={language} setLanguage={setLanguage} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
