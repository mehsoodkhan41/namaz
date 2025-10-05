import React from 'react';
import { Globe, ChevronDown, MapPin } from 'lucide-react';
import { provinces } from '../data/cities';

interface ProvinceSelectorProps {
  selectedProvince: string;
  onProvinceChange: (province: string) => void;
  isLoading: boolean;
}

const ProvinceSelector: React.FC<ProvinceSelectorProps> = ({
  selectedProvince,
  onProvinceChange,
  isLoading
}) => {
  return (
    <div className="space-y-4 fade-in-scale" dir="rtl">
      <label className="flex items-center text-xl font-semibold text-gray-800 jameel-font">
        <Globe className="h-6 w-6 ml-3 text-emerald-600 glow-effect" />
        صوبہ منتخب کریں
      </label>
      
      <div className="relative">
        <select
          value={selectedProvince}
          onChange={(e) => onProvinceChange(e.target.value)}
          disabled={isLoading}
          className="w-full px-8 py-6 border-3 border-emerald-300 rounded-3xl focus:ring-6 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-500 disabled:opacity-50 text-right jameel-font text-xl bg-gradient-to-r from-white to-emerald-50 shadow-islamic hover:shadow-divine appearance-none cursor-pointer islamic-glow"
        >
          <option value="">صوبہ منتخب کریں</option>
          {provinces.map((province) => (
            <option key={province.name} value={province.name}>
              {province.nameUrdu}
            </option>
          ))}
        </select>
        
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="h-8 w-8 text-emerald-500 breathe-animation" />
        </div>
      </div>
      
      {selectedProvince && (
        <div className="mt-6 glass-effect rounded-2xl p-6 border border-emerald-200 shadow-islamic slide-in-up">
          <div className="flex items-center mb-3">
            <MapPin className="h-5 w-5 text-emerald-600 ml-2" />
            <p className="text-lg font-semibold text-emerald-800 jameel-font">
              منتخب شدہ صوبہ
            </p>
          </div>
          <p className="text-emerald-700 jameel-font text-xl font-bold">
            {provinces.find(p => p.name === selectedProvince)?.nameUrdu}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-emerald-600 jameel-font">
              دستیاب شہروں کی تعداد:
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold">
              {provinces.find(p => p.name === selectedProvince)?.cities.length}
            </span>
          </div>
        </div>
      )}
      
      {!selectedProvince && (
        <div className="mt-6 glass-effect rounded-2xl p-6 border border-gray-200">
          <div className="text-center">
            <Globe className="h-12 w-12 mx-auto text-gray-400 mb-3 float-animation" />
            <p className="text-gray-600 jameel-font">
              پہلے اپنا صوبہ منتخب کریں
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvinceSelector;