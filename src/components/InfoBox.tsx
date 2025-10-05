import React from 'react';
import { Info, BookOpen, MapPin } from 'lucide-react';

const InfoBox: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-8" dir="rtl">
      <div className="flex items-center mb-6">
        <Info className="h-6 w-6 text-blue-600 ml-2" />
        <h3 className="text-2xl font-bold text-blue-800 jameel-font">اہم معلومات</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <BookOpen className="h-5 w-5 text-blue-600 ml-2 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 jameel-font mb-2">حنفی فقہ</h4>
              <p className="text-blue-700 text-sm jameel-font leading-relaxed">
                یہ ایپلیکیشن مکمل طور پر حنفی فقہ کے مطابق نماز کے اوقات فراہم کرتی ہے۔ 
                کراچی یونیورسٹی کے طریقہ کار کا استعمال کیا گیا ہے۔
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-blue-600 ml-2 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 jameel-font mb-2">جغرافیائی کوریج</h4>
              <p className="text-blue-700 text-sm jameel-font leading-relaxed">
                پاکستان کے تمام صوبوں اور علاقوں کے بڑے شہروں کے لیے درست اوقات۔
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-blue-200">
          <h4 className="font-semibold text-blue-800 jameel-font mb-3">نماز کے اوقات</h4>
          <div className="space-y-2 text-sm jameel-font">
            <div className="flex justify-between">
              <span className="text-blue-700">فجر</span>
              <span className="text-blue-600">صبح صادق سے طلوع آفتاب تک</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">ظہر</span>
              <span className="text-blue-600">زوال سے عصر تک</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">عصر</span>
              <span className="text-blue-600">حنفی طریقے سے</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">مغرب</span>
              <span className="text-blue-600">غروب آفتاب کے بعد</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">عشاء</span>
              <span className="text-blue-600">شفق کے غائب ہونے کے بعد</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;