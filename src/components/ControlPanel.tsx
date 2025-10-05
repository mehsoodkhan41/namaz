import React from 'react';
import { MapPin, Settings, Globe } from 'lucide-react';
import { provinces, calculationMethods, Province, City } from '../data/cities';

interface ControlPanelProps {
  selectedProvince: string;
  selectedCity: string;
  selectedMethod: number;
  onProvinceChange: (province: string) => void;
  onCityChange: (city: string) => void;
  onMethodChange: (method: number) => void;
  isLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedProvince,
  selectedCity,
  selectedMethod,
  onProvinceChange,
  onCityChange,
  onMethodChange,
  isLoading
}) => {
  const currentProvince = provinces.find(p => p.name === selectedProvince);
  const currentCity = currentProvince?.cities.find(c => c.name === selectedCity);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Settings className="h-5 w-5 mr-2 text-emerald-600" />
        Prayer Time Settings
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Province Selection */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Globe className="h-4 w-4 mr-2" />
            Province / صوبہ
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => onProvinceChange(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:opacity-50"
          >
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option key={province.name} value={province.name}>
                {province.name} - {province.nameUrdu}
              </option>
            ))}
          </select>
        </div>

        {/* City Selection */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4 mr-2" />
            City / شہر
          </label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={isLoading || !selectedProvince}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:opacity-50"
          >
            <option value="">Select City</option>
            {currentProvince?.cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name} - {city.nameUrdu}
              </option>
            ))}
          </select>
        </div>

        {/* Calculation Method */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Settings className="h-4 w-4 mr-2" />
            Method / طریقہ
          </label>
          <select
            value={selectedMethod}
            onChange={(e) => onMethodChange(Number(e.target.value))}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:opacity-50"
          >
            {calculationMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.name} - {method.nameUrdu}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Location Info */}
      {currentCity && (
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-sm text-emerald-800">
            <strong>Selected Location:</strong> {currentCity.name} ({currentCity.nameUrdu}), {currentProvince?.nameUrdu}
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Coordinates: {currentCity.latitude}°N, {currentCity.longitude}°E
          </p>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;