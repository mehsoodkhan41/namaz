import React from 'react';
import { MapPin, ChevronDown, Navigation } from 'lucide-react';
import { provinces } from '../data/cities';

interface CitySelectorProps {
  selectedProvince: string;
  selectedCity: string;
  onCityChange: (city: string) => void;
  isLoading: boolean;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedProvince,
  selectedCity,
  onCityChange,
  isLoading
}) => {
  const currentProvince = provinces.find(p => p.name === selectedProvince);

  return (
    <div className="space-y-4 fade-in-scale" style={{ animationDelay: '0.1s' }} dir="rtl">
      <label className="flex items-center text-xl font-semibold text-gray-800 jameel-font">
        <MapPin className="h-6 w-6 ml-3 text-emerald-600 glow-effect" />
        شہر منتخب کریں
      </label>
      
      <div className="relative">
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={isLoading || !selectedProvince}
          className="w-full px-8 py-6 border-3 border-emerald-300 rounded-3xl focus:ring-6 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-500 disabled:opacity-50 text-right jameel-font text-xl bg-gradient-to-r from-white to-emerald-50 shadow-islamic hover:shadow-divine appearance-none cursor-pointer islamic-glow"
        >
          <option value="">شہر منتخب کریں</option>
          {currentProvince?.cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.nameUrdu}
            </option>
          ))}
        </select>
        
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="h-8 w-8 text-emerald-500 breathe-animation" />
        </div>
      </div>
      
      {selectedCity && currentProvince && (
        <div className="mt-6 glass-effect rounded-2xl p-6 border border-emerald-200 shadow-islamic slide-in-up">
          <div className="flex items-center mb-4">
            <Navigation className="h-5 w-5 text-emerald-600 ml-2" />
            <p className="text-lg font-semibold text-emerald-800 jameel-font">
              منتخب شدہ مقام
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-emerald-700 jameel-font text-xl font-bold">
              {currentProvince.cities.find(c => c.name === selectedCity)?.nameUrdu}, {currentProvince.nameUrdu}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="glass-dark rounded-xl p-3">
                <p className="text-xs text-emerald-600 jameel-font mb-1">عرض البلد</p>
                <p className="text-emerald-800 font-bold english-font">
                  {currentProvince.cities.find(c => c.name === selectedCity)?.latitude}°N
                </p>
              </div>
              <div className="glass-dark rounded-xl p-3">
                <p className="text-xs text-emerald-600 jameel-font mb-1">طول البلد</p>
                <p className="text-emerald-800 font-bold english-font">
                  {currentProvince.cities.find(c => c.name === selectedCity)?.longitude}°E
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!selectedProvince && (
        <div className="mt-6 glass-effect rounded-2xl p-6 border border-yellow-200 bg-yellow-50">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto text-yellow-500 mb-3 float-animation" />
            <p className="text-yellow-800 jameel-font font-medium">
              پہلے صوبہ منتخب کریں
            </p>
          </div>
        </div>
      )}
      
      {selectedProvince && !selectedCity && (
        <div className="mt-6 glass-effect rounded-2xl p-6 border border-blue-200 bg-blue-50">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto text-blue-500 mb-3 pulse-glow" />
            <p className="text-blue-800 jameel-font font-medium">
              اب اپنا شہر منتخب کریں
            </p>
            <p className="text-blue-600 jameel-font text-sm mt-2">
              {currentProvince?.cities.length} شہر دستیاب ہیں
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;