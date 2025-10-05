import React, { useState, useEffect } from 'react';
import { Clock, Star, Zap, Timer } from 'lucide-react';
import { PrayerTime, getTimeRemaining, getNextPrayer } from '../services/prayerTimesApi';

interface NextPrayerCountdownProps {
  prayerTimes: PrayerTime[];
}

const NextPrayerCountdown: React.FC<NextPrayerCountdownProps> = ({ prayerTimes }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prayerTimes.length > 0) {
      const next = getNextPrayer(prayerTimes);
      setNextPrayer(next);
    }
  }, [prayerTimes]);

  useEffect(() => {
    if (nextPrayer) {
      const targetTime = new Date(nextPrayer.timestamp);
      const remaining = getTimeRemaining(targetTime);
      setTimeRemaining(remaining);
    }
  }, [currentTime, nextPrayer]);

  if (!nextPrayer || !prayerTimes.length) {
    return null;
  }

  const isTimeUp = timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds === 0;

  return (
    <div className="relative overflow-hidden slide-in-up" dir="rtl">
      {/* Background with Islamic Pattern */}
      <div className="absolute inset-0 gradient-islamic opacity-90 rounded-3xl"></div>
      <div className="absolute inset-0 islamic-pattern opacity-20 rounded-3xl"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-4 left-4 opacity-30">
        <Zap className="h-6 w-6 text-yellow-300 float-animation" />
      </div>
      <div className="absolute bottom-4 right-4 opacity-30">
        <Timer className="h-5 w-5 text-yellow-300 float-animation" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10 glass-effect text-white rounded-3xl shadow-premium p-8 mb-8">
        <div className="text-center">
          {/* Header */}
          <div className="flex items-center justify-center mb-6 fade-in-scale">
            <div className="relative">
              <Star className="h-10 w-10 text-yellow-300 ml-3 glow-effect" />
              <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-20 animate-ping"></div>
            </div>
            <h3 className="text-3xl font-bold jameel-font bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
              اگلی نماز
            </h3>
          </div>
          
          {/* Prayer Name */}
          <div className="mb-8 pulse-glow rounded-2xl p-6 glass-dark">
            <h4 className="text-4xl md:text-5xl font-bold jameel-font mb-3 text-yellow-300">
              {nextPrayer.nameUrdu}
            </h4>
            <p className="text-emerald-100 text-2xl jameel-font flex items-center justify-center">
              <Clock className="h-6 w-6 ml-2" />
              {nextPrayer.time}
            </p>
          </div>

          {/* Countdown Timer */}
          {!isTimeUp ? (
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-6">
              {[
                { value: timeRemaining.hours, label: 'گھنٹے', delay: '0s' },
                { value: timeRemaining.minutes, label: 'منٹ', delay: '0.1s' },
                { value: timeRemaining.seconds, label: 'سیکنڈ', delay: '0.2s' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="countdown-premium rounded-3xl p-8 fade-in-scale"
                  style={{ animationDelay: item.delay }}
                >
                  <div className="text-5xl md:text-6xl font-bold jameel-font text-yellow-300 mb-3 digital-clock">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-base text-emerald-100 jameel-font font-semibold">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-6 pulse-glow">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900 rounded-2xl p-6 font-bold jameel-font text-2xl shadow-premium">
                <div className="flex items-center justify-center">
                  <Star className="h-8 w-8 ml-2 animate-spin" />
                  نماز کا وقت ہو گیا!
                </div>
              </div>
            </div>
          )}

          {/* Current Time Display */}
          <div className="glass-dark rounded-xl p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-reverse space-x-3">
              <Clock className="h-5 w-5 text-emerald-300" />
              <span className="text-emerald-100 jameel-font text-lg">
                موجودہ وقت:
              </span>
              <span className="text-white font-bold english-font text-xl">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
            
            {/* Date Display */}
            <div className="mt-2 text-emerald-200 text-sm jameel-font">
              {currentTime.toLocaleDateString('ur-PK', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${Math.max(0, Math.min(100, ((24 * 60 * 60) - (timeRemaining.hours * 3600 + timeRemaining.minutes * 60 + timeRemaining.seconds)) / (24 * 60 * 60) * 100))}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextPrayerCountdown;