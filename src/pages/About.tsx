import React from 'react';
import { Info, Heart, Code, Star, Sparkles, Mail, Phone, Globe } from 'lucide-react';

interface AboutProps {
  darkMode: boolean;
  language: 'ur' | 'en';
}

function About({ darkMode, language }: AboutProps) {
  const isEnglish = language === 'en';
  const dir = isEnglish ? 'ltr' : 'rtl';
  const t = (urdu: string, english: string) => (isEnglish ? english : urdu);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="surface-hero rounded-3xl p-8 text-center backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-12 h-12 drop-shadow-lg animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg" dir={dir}>
          {t('اوقات نماز پاکستان کے بارے میں', 'About Prayer Times Pakistan')}
        </h1>
        <p className="text-xl drop-shadow-md" dir={dir}>
          {t('ایک مکمل اسلامی ساتھی ایپلیکیشن', 'A complete Islamic companion application')}
        </p>
      </div>

      {/* About Content */}
      <div className="surface-panel rounded-3xl shadow-2xl p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
        <div className="flex items-center mb-6">
          <Info className="w-8 h-8 mr-3 drop-shadow-md text-emerald-500 dark:text-emerald-300" />
          <h2 className="text-3xl font-bold" dir={dir}>{t('ایپ کے بارے میں', 'About the app')}</h2>
        </div>

        <div className="space-y-4" dir={dir}>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-200">
            {t(
              'یہ ایپلیکیشن پاکستان کے تمام شہروں کے لیے درست نماز کے اوقات فراہم کرتی ہے۔ یہ جامعہ اسلامک سائنسز کراچی کے حنفی طریقہ کار کے مطابق بنائی گئی ہے۔',
              'This application provides accurate prayer timings for every city across Pakistan, following the Hanafi method of the University of Islamic Sciences, Karachi.'
            )}
          </p>

          <div className="surface-panel p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <h3 className="text-2xl font-bold mb-4">{t('خصوصیات:', 'Highlights')}</h3>
            <ul className="space-y-3 text-lg">
              <li className="flex items-start transition-all duration-300 hover:translate-x-2">
                <span className="text-emerald-500 dark:text-emerald-300">✓</span>
                <span className={isEnglish ? 'ml-2' : 'mr-2'}>{t('تمام پاکستانی شہروں کے نماز کے اوقات', 'Prayer schedule for every Pakistani city')}</span>
              </li>
              <li className="flex items-start transition-all duration-300 hover:translate-x-2">
                <span className="text-emerald-500 dark:text-emerald-300">✓</span>
                <span className={isEnglish ? 'ml-2' : 'mr-2'}>{t('اگلی نماز تک لائیو کاؤنٹ ڈاؤن', 'Live countdown to the next prayer')}</span>
              </li>
              <li className="flex items-start transition-all duration-300 hover:translate-x-2">
                <span className="text-emerald-500 dark:text-emerald-300">✓</span>
                <span className={isEnglish ? 'ml-2' : 'mr-2'}>{t('نماز کی ٹریکنگ اور پیشرفت', 'Prayer tracking and daily progress')}</span>
              </li>
              <li className="flex items-start transition-all duration-300 hover:translate-x-2">
                <span className="text-emerald-500 dark:text-emerald-300">✓</span>
                <span className={isEnglish ? 'ml-2' : 'mr-2'}>{t('نماز کے وقت نوٹیفکیشنز', 'Prayer time notifications')}</span>
              </li>
              <li className="flex items-start transition-all duration-300 hover:translate-x-2">
                <span className="text-emerald-500 dark:text-emerald-300">✓</span>
                <span className={isEnglish ? 'ml-2' : 'mr-2'}>{t('قبلہ کمپاس', 'Qibla compass')}</span>
              </li>
              <li className="flex items-start transition-all duration-300 hover:translate-x-2">
                <span className="text-emerald-500 dark:text-emerald-300">✓</span>
                <span className={isEnglish ? 'ml-2' : 'mr-2'}>{t('ڈیجیٹل تسبیح کاؤنٹر', 'Digital tasbih counter')}</span>
              </li>
              <li className="flex items-start transition-all duration-300 hover:translate-x-2">
                <span className="text-emerald-500 dark:text-emerald-300">✓</span>
                <span className={isEnglish ? 'ml-2' : 'mr-2'}>{t('روزمرہ کی دعائیں', 'Daily duas')}</span>
              </li>
              <li className="flex items-start transition-all duration-300 hover:translate-x-2">
                <span className="text-emerald-500 dark:text-emerald-300">✓</span>
                <span className={isEnglish ? 'ml-2' : 'mr-2'}>{t('رمضان کی خصوصی سہولیات', 'Ramadan-focused utilities')}</span>
              </li>
              <li className="flex items-start transition-all duration-300 hover:translate-x-2">
                <span className="text-emerald-500 dark:text-emerald-300">✓</span>
                <span className={isEnglish ? 'ml-2' : 'mr-2'}>{t('ڈارک موڈ', 'Dark mode')}</span>
              </li>
              <li className="flex items-start transition-all duration-300 hover:translate-x-2">
                <span className="text-emerald-500 dark:text-emerald-300">✓</span>
                <span className={isEnglish ? 'ml-2' : 'mr-2'}>{t('GPS سے مقام کی تلاش', 'Location search via GPS')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="surface-panel rounded-3xl shadow-2xl p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
        <div className="flex items-center mb-6">
          <Code className="w-8 h-8 mr-3 drop-shadow-md text-indigo-500 dark:text-indigo-300" />
          <h2 className="text-3xl font-bold" dir={dir}>{t('ٹیکنالوجی', 'Technology')}</h2>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4`}>
          {['React', 'TypeScript', 'Tailwind CSS', 'Vite'].map((tech) => (
            <div key={tech} className="chip-soft p-5 rounded-2xl text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <p className="font-semibold drop-shadow-sm">{tech}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Credits */}
      <div className="surface-accent rounded-3xl shadow-2xl p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
        <div className="flex items-center justify-center mb-6">
          <Heart className="w-8 h-8 mr-3 drop-shadow-lg animate-pulse text-pink-200" />
          <h2 className="text-3xl font-bold drop-shadow-md" dir={dir}>{t('تشکر', 'With gratitude')}</h2>
        </div>

        <div className="text-center space-y-4" dir={dir}>
          <p className="text-lg drop-shadow-md text-white/95">
            {t('اس ایپلیکیشن کو پیار اور محنت سے بنایا گیا ہے', 'Crafted with care and intention')}
          </p>
          <p className="text-lg drop-shadow-md text-white/85">
            API: Aladhan Prayer Times API
          </p>
          <p className="text-lg drop-shadow-md text-white/85">
            Prayer Method: University of Islamic Sciences, Karachi
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="surface-panel rounded-3xl shadow-2xl p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
        <div className="flex items-center mb-6 justify-center">
          <Mail className="w-8 h-8 mr-3 drop-shadow-md text-blue-500 dark:text-blue-300" />
          <h2 className="text-3xl font-bold" dir={dir}>{t('رابطہ کریں', 'Contact Us')}</h2>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          {/* WhatsApp */}
          <a
            href="https://wa.me/923376087139"
            target="_blank"
            rel="noopener noreferrer"
            className="chip-soft p-5 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-4"
            data-variant="emerald"
          >
            <Phone className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-lg">{t('واٹس ایپ', 'WhatsApp')}</p>
              <p className="text-sm opacity-80">+92 337 6087139</p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:zameerahmedmehsood@gmail.com"
            className="chip-soft p-5 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-4"
            data-variant="sky"
          >
            <Mail className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-lg">{t('ای میل', 'Email')}</p>
              <p className="text-sm opacity-80">zameerahmedmehsood@gmail.com</p>
            </div>
          </a>

          {/* Website */}
          <a
            href="https://www.zameerahmed.online"
            target="_blank"
            rel="noopener noreferrer"
            className="chip-soft p-5 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-4"
            data-variant="violet"
          >
            <Globe className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-lg">{t('ویب سائٹ', 'Website')}</p>
              <p className="text-sm opacity-80">www.zameerahmed.online</p>
            </div>
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} dir={dir}>
            {t('کسی بھی سوال یا مشورے کے لیے بلا جھجھک رابطہ کریں', 'Feel free to reach out for any questions or suggestions')}
          </p>
        </div>
      </div>

      {/* Version */}
      <div className="surface-panel rounded-3xl shadow-2xl p-6 text-center backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5 drop-shadow-md text-amber-400" />
          <p className="text-slate-600 dark:text-slate-300">
            Version 1.0.0 | © 2025 Prayer Times Pakistan
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
