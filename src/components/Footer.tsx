import React from 'react';
import { Mail, Phone, Info, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-center md:justify-end jameel-font">
              <Phone className="h-5 w-5 ml-2" />
              رابطہ کی معلومات
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-end">
                <span className="jameel-font text-lg"> 03376087139 </span>
                <Phone className="h-4 w-4 ml-2 text-emerald-400" />
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <span className="text-sm"> zameerahmedmehsood@gmail.com </span>
                <Mail className="h-4 w-4 ml-2 text-emerald-400" />
              </div>
            </div>
          </div>
          
          {/* About Hanafi Fiqh */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-center jameel-font">
              <Info className="h-5 w-5 ml-2" />
              حنفی فقہ کے بارے میں
            </h3>
            <div className="text-gray-300 text-sm space-y-2 jameel-font leading-relaxed">
              <p>یہ ایپلیکیشن مکمل طور پر حنفی فقہ کے مطابق نماز کے اوقات دکھاتی ہے</p>
              <p>خاص طور پر عصر کی نماز کا وقت حنفی اور شافعی فقہ میں مختلف ہے</p>
              <p>حنفی فقہ میں عصر کا وقت دیر سے شروع ہوتا ہے</p>
            </div>
          </div>
          
          {/* Coverage Area */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-center md:justify-start jameel-font">
              <MapPin className="h-5 w-5 ml-2" />
              علاقائی کوریج
            </h3>
            <div className="text-gray-300 text-sm space-y-1 jameel-font">
              <p>• پنجاب کے تمام بڑے شہر</p>
              <p>• سندھ، خیبر پختونخوا، بلوچستان</p>
              <p>• اسلام آباد، آزاد کشمیر، گلگت بلتستان</p>
              <p className="text-xs mt-3 text-gray-400">
                کراچی یونیورسٹی کے طریقہ کار کے مطابق
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm jameel-font">
            © 2025 اوقات نماز پاکستان - تمام حقوق محفوظ ہیں
          </p>
          <p className="text-gray-500 text-sm mt-2 jameel-font">
           اللہ تعالیٰ ہم سب کو پانچ وقت کی نماز کی توفیق عطا فرمائے - آمین
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;