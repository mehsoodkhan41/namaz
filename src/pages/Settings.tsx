import React from 'react';
import { Settings as SettingsIcon, Bell, Moon, Sun, Volume2, VolumeX, Languages } from 'lucide-react';

interface SettingsProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  azanSound: string;
  setAzanSound: (value: string) => void;
  language: 'ur' | 'en';
  setLanguage: (value: 'ur' | 'en') => void;
}

function Settings({
  darkMode,
  setDarkMode,
  notificationsEnabled,
  setNotificationsEnabled,
  azanSound,
  setAzanSound,
  language,
  setLanguage
}: SettingsProps) {
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const isEnglish = language === 'en';
  const dir = isEnglish ? 'ltr' : 'rtl';
  const t = (urdu: string, english: string) => (isEnglish ? english : urdu);

  const azanSoundOptions = [
    {
      value: 'classic',
      title: t('Classic Makkah', 'Classic Makkah'),
      description: t('روایتی مکمل اذان کی آواز', 'Traditional full-length azan recitation')
    },
    {
      value: 'madina',
      title: t('Madina Echo', 'Madina Echo'),
      description: t('مدینہ منورہ کے انداز کی پر سکون اذان', 'Gentle Madina-style echo azan')
    },
    {
      value: 'short',
      title: t('Short Alert', 'Short Alert'),
      description: t('مختصر یاد دہانی کے لیے مختصر ٹون', 'Concise reminder tone')
    }
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="surface-hero rounded-3xl p-8 text-center backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
        <div className="flex items-center justify-center mb-4">
          <SettingsIcon className="w-12 h-12 drop-shadow-lg animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <h1 className="text-4xl font-bold mb-2 drop-shadow-lg" dir={dir}>
          {t('ترتیبات', 'Settings')}
        </h1>
        <p className="text-xl drop-shadow-md" dir={dir}>
          {t('اپنی ایپ کو اپنی پسند کے مطابق بنائیں', 'Fine-tune the app the way you like it')}
        </p>
      </div>

      {/* Appearance Settings */}
      <div className="surface-panel rounded-3xl shadow-2xl p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
        <h2 className="text-2xl font-bold mb-6 drop-shadow-sm" dir={dir}>
          <Moon className="inline w-6 h-6 ml-2 drop-shadow-md" />
          {t('ظاہری شکل', 'Appearance')}
        </h2>

        <div className="space-y-4">
          {/* Dark Mode Toggle */}
          <div className="chip-soft flex items-center justify-between p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm text-slate-700 dark:text-slate-100">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-6 h-6 drop-shadow-md" /> : <Sun className="w-6 h-6 drop-shadow-md" />}
              <div>
                <p className="font-semibold text-lg" dir={dir}>{t('ڈارک موڈ', 'Dark mode')}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300" dir={dir}>
                  {t('رات کے لیے آنکھوں پر آسان تھیم', 'A softer theme that works better at night')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-inner ${
                darkMode ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Language Selection */}
          <div className="chip-soft flex items-center justify-between p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm text-slate-700 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <Languages className="w-6 h-6 drop-shadow-md" />
              <div>
                <p className="font-semibold text-lg" dir={dir}>
                  {t('زبان', 'Language')}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-300" dir={dir}>
                  {t('اردو / English', 'English / Urdu')}
                </p>
              </div>
            </div>
            <div className="relative w-full max-w-[180px]">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'ur' | 'en')}
                className={`appearance-none w-full px-4 py-2 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md bg-white border-emerald-100 text-slate-700 dark:bg-slate-900/70 dark:border-slate-600 dark:text-slate-100 ${isEnglish ? 'pr-10 text-left' : 'pl-10 text-right'}`}
                style={{ direction: isEnglish ? 'ltr' : 'rtl' }}
              >
                <option value="ur">{t('اردو', 'Urdu')}</option>
                <option value="en">{t('انگریزی', 'English')}</option>
              </select>
              <span
                className={`pointer-events-none absolute inset-y-0 flex items-center text-slate-400 dark:text-slate-500 ${isEnglish ? 'right-3' : 'left-3 rotate-180'}`}
              >
                
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="surface-panel rounded-3xl shadow-2xl p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
        <h2 className="text-2xl font-bold mb-6 drop-shadow-sm" dir={dir}>
          <Bell className="inline w-6 h-6 ml-2 drop-shadow-md" />
          {t('نوٹیفکیشنز', 'Notifications')}
        </h2>

        <div className="space-y-4">
          {/* Notifications Toggle */}
          <div className="chip-soft flex items-center justify-between p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm text-slate-700 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 drop-shadow-md" />
              <div>
                <p className="font-semibold text-lg" dir={dir}>{t('نماز کی یاد دہانی', 'Prayer reminders')}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300" dir={dir}>
                  {t('نماز کے وقت نوٹیفکیشن موصول کریں', 'Receive a ping when it is time to pray')}
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                if (!notificationsEnabled) {
                  await requestNotificationPermission();
                } else {
                  setNotificationsEnabled(false);
                }
              }}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-inner ${
                notificationsEnabled ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                  notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="chip-soft flex items-center justify-between p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm text-slate-700 dark:text-slate-100">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="w-6 h-6 drop-shadow-md" /> : <VolumeX className="w-6 h-6 drop-shadow-md" />}
              <div>
                <p className="font-semibold text-lg" dir={dir}>{t('آواز', 'Sound')}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300" dir={dir}>
                  {t('نوٹیفکیشن کی آواز', 'Control the notification tone')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-inner ${
                soundEnabled ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                  soundEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="chip-soft flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm text-slate-700 dark:text-slate-100">
            <div>
              <p className="font-semibold text-lg" dir={dir}>{t('آذان کی آواز', 'Azan audio')}</p>
              <p className="text-sm text-slate-500 dark:text-slate-300" dir={dir}>{t('اپنی پسندیدہ آذان کا انتخاب کریں', 'Choose the azan sound you prefer')}</p>
            </div>
            <div className="grid gap-3 w-full md:w-1/2">
              {azanSoundOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-3 p-3 rounded-xl border border-emerald-100/70 dark:border-slate-600 hover:border-emerald-400 transition-colors duration-200"
                >
                  <input
                    type="radio"
                    name="azan-sound"
                    value={option.value}
                    checked={azanSound === option.value}
                    onChange={(e) => setAzanSound(e.target.value)}
                    className="mt-1 h-4 w-4 accent-emerald-500"
                  />
                  <div dir={dir}>
                    <p className="font-semibold">{option.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prayer Method Info */}
      <div className="surface-ocean rounded-3xl shadow-2xl p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
        <h2 className="text-2xl font-bold mb-4 drop-shadow-md" dir={dir}>{t('حساب کا طریقہ', 'Calculation method')}</h2>
        <div className="space-y-2 text-sm drop-shadow-md text-white/90" dir={dir}>
          <p>• {t('جامعہ اسلامک سائنسز، کراچی', 'University of Islamic Sciences, Karachi')}</p>
          <p>• {t('حنفی فقہ', 'Hanafi fiqh')}</p>
          <p>• {t('فجر زاویہ: 18°', 'Fajr angle: 18°')}</p>
          <p>• {t('عشاء زاویہ: 18°', 'Isha angle: 18°')}</p>
        </div>
      </div>

      {/* About App */}
      <div className="surface-panel rounded-3xl shadow-2xl p-6 text-center backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Version 1.0.0
        </p>
        <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">
          © 2025 Prayer Times Pakistan
        </p>
      </div>
    </div>
  );
}

export default Settings;
