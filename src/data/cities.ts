export interface City {
  name: string;
  nameUrdu: string;
  latitude: number;
  longitude: number;
}

export interface Province {
  name: string;
  nameUrdu: string;
  cities: City[];
}

export const provinces: Province[] = [
  {
    name: "Punjab",
    nameUrdu: "پنجاب",
    cities: [
      { name: "Lahore", nameUrdu: "لاہور", latitude: 31.5204, longitude: 74.3587 },
      { name: "Faisalabad", nameUrdu: "فیصل آباد", latitude: 31.4504, longitude: 73.1350 },
      { name: "Rawalpindi", nameUrdu: "راولپنڈی", latitude: 33.5651, longitude: 73.0169 },
      { name: "Multan", nameUrdu: "ملتان", latitude: 30.1575, longitude: 71.5249 },
      { name: "Gujranwala", nameUrdu: "گجرانوالہ", latitude: 32.1877, longitude: 74.1945 },
      { name: "Sialkot", nameUrdu: "سیالکوٹ", latitude: 32.4945, longitude: 74.5229 },
      { name: "Bahawalpur", nameUrdu: "بہاولپور", latitude: 29.4167, longitude: 71.6833 },
      { name: "Sargodha", nameUrdu: "سرگودھا", latitude: 32.0837, longitude: 72.6715 },
      { name: "Sheikhupura", nameUrdu: "شیخوپورہ", latitude: 31.7167, longitude: 73.9833 },
      { name: "Jhang", nameUrdu: "جھنگ", latitude: 31.2681, longitude: 72.3317 },
      { name: "Gujrat", nameUrdu: "گجرات", latitude: 32.5740, longitude: 74.0788 },
      { name: "Kasur", nameUrdu: "قصور", latitude: 31.1156, longitude: 74.4502 },
      { name: "Okara", nameUrdu: "اوکاڑہ", latitude: 30.8081, longitude: 73.4534 },
      { name: "Sahiwal", nameUrdu: "ساہیوال", latitude: 30.6682, longitude: 73.1114 },
      { name: "Wah Cantonment", nameUrdu: "واہ کینٹ", latitude: 33.7969, longitude: 72.7297 },
      { name: "Dera Ghazi Khan", nameUrdu: "ڈیرہ غازی خان", latitude: 30.0561, longitude: 70.6403 },
      { name: "Muridke", nameUrdu: "مریدکے", latitude: 31.8000, longitude: 74.2667 },
      { name: "Jhelum", nameUrdu: "جہلم", latitude: 32.9425, longitude: 73.7257 },
      { name: "Khanpur", nameUrdu: "خانپور", latitude: 28.6500, longitude: 70.6833 },
      { name: "Hafizabad", nameUrdu: "حافظ آباد", latitude: 32.0667, longitude: 73.6833 },
      { name: "Chiniot", nameUrdu: "چنیوٹ", latitude: 31.7167, longitude: 72.9833 },
      { name: "Kamoke", nameUrdu: "کاموکے", latitude: 31.9667, longitude: 74.2167 },
      { name: "Mandi Bahauddin", nameUrdu: "منڈی بہاؤالدین", latitude: 32.5833, longitude: 73.4167 },
      { name: "Toba Tek Singh", nameUrdu: "ٹوبہ ٹیک سنگھ", latitude: 30.9667, longitude: 72.4833 },
      { name: "Ahmadpur East", nameUrdu: "احمدپور شرقیہ", latitude: 29.1439, longitude: 71.2583 },
      { name: "Kamalia", nameUrdu: "کمالیہ", latitude: 30.7333, longitude: 72.6500 },
      { name: "Khushab", nameUrdu: "خوشاب", latitude: 32.2967, longitude: 72.3469 },
      { name: "Wazirabad", nameUrdu: "وزیرآباد", latitude: 32.4500, longitude: 74.1167 },
      { name: "Sukheke", nameUrdu: "سکھیکے", latitude: 31.8667, longitude: 73.5000 },
      { name: "Lalamusa", nameUrdu: "لالہ موسیٰ", latitude: 32.7167, longitude: 73.9833 },
      { name: "Muzaffargarh", nameUrdu: "مظفرگڑھ", latitude: 30.0734, longitude: 71.1929 },
      { name: "Pakpattan", nameUrdu: "پاکپتن", latitude: 30.3436, longitude: 73.3911 },
      { name: "Vehari", nameUrdu: "وہاڑی", latitude: 30.0452, longitude: 72.3489 },
      { name: "Khanewal", nameUrdu: "خانیوال", latitude: 30.3017, longitude: 71.9322 },
      { name: "Attock", nameUrdu: "اٹک", latitude: 33.7669, longitude: 72.3581 },
      { name: "Chakwal", nameUrdu: "چکوال", latitude: 32.9328, longitude: 72.8630 },
      { name: "Narowal", nameUrdu: "نارووال", latitude: 32.1025, longitude: 74.8736 },
      { name: "Mianwali", nameUrdu: "میانوالی", latitude: 32.5881, longitude: 71.5492 },
      { name: "Bhakkar", nameUrdu: "بھکر", latitude: 31.6289, longitude: 71.0681 },
      { name: "Rajanpur", nameUrdu: "راجن پور", latitude: 29.1044, longitude: 70.3301 },
      { name: "Leiah", nameUrdu: "لیہ", latitude: 30.9697, longitude: 70.9428 }
    ]
  },
  {
    name: "Sindh",
    nameUrdu: "سندھ",
    cities: [
      { name: "Karachi", nameUrdu: "کراچی", latitude: 24.8607, longitude: 67.0011 },
      { name: "Hyderabad", nameUrdu: "حیدرآباد", latitude: 25.3960, longitude: 68.3578 },
      { name: "Sukkur", nameUrdu: "سکھر", latitude: 27.7052, longitude: 68.8574 },
      { name: "Larkana", nameUrdu: "لاڑکانہ", latitude: 27.5590, longitude: 68.2123 },
      { name: "Nawabshah", nameUrdu: "نوابشاہ", latitude: 26.2442, longitude: 68.4100 },
      { name: "Mirpurkhas", nameUrdu: "میر پور خاص", latitude: 25.5286, longitude: 69.0142 },
      { name: "Jacobabad", nameUrdu: "جیکب آباد", latitude: 28.2820, longitude: 68.4375 },
      { name: "Shikarpur", nameUrdu: "شکارپور", latitude: 27.9506, longitude: 68.6384 },
      { name: "Dadu", nameUrdu: "دادو", latitude: 26.7290, longitude: 67.7790 },
      { name: "Thatta", nameUrdu: "ٹھٹہ", latitude: 24.7461, longitude: 67.9242 },
      { name: "Khairpur", nameUrdu: "خیرپور", latitude: 27.5297, longitude: 68.7592 },
      { name: "Rohri", nameUrdu: "روہڑی", latitude: 27.6667, longitude: 68.9000 },
      { name: "Kotri", nameUrdu: "کوٹری", latitude: 25.3667, longitude: 68.3167 },
      { name: "Umerkot", nameUrdu: "عمرکوٹ", latitude: 25.3549, longitude: 69.7378 },
      { name: "Ghotki", nameUrdu: "گھوٹکی", latitude: 28.0167, longitude: 69.3167 },
      { name: "Sanghar", nameUrdu: "سانگھڑ", latitude: 26.0467, longitude: 68.9481 },
      { name: "Kashmor", nameUrdu: "کشمور", latitude: 28.4333, longitude: 69.5833 },
      { name: "Matiari", nameUrdu: "مٹیاری", latitude: 25.5967, longitude: 68.4467 },
      { name: "Tando Allahyar", nameUrdu: "ٹنڈو الہ یار", latitude: 25.4600, longitude: 68.7200 },
      { name: "Badin", nameUrdu: "بدین", latitude: 24.6550, longitude: 68.8378 }
    ]
  },
  {
    name: "Khyber Pakhtunkhwa",
    nameUrdu: "خیبر پختونخوا",
    cities: [
      { name: "Peshawar", nameUrdu: "پشاور", latitude: 34.0151, longitude: 71.5249 },
      { name: "Mardan", nameUrdu: "مردان", latitude: 34.1982, longitude: 72.0360 },
      { name: "Mingora", nameUrdu: "منگورہ", latitude: 34.7797, longitude: 72.3616 },
      { name: "Kohat", nameUrdu: "کوہاٹ", latitude: 33.5819, longitude: 71.4425 },
      { name: "Bannu", nameUrdu: "بنوں", latitude: 32.9889, longitude: 70.6042 },
      { name: "Abbottabad", nameUrdu: "ایبٹ آباد", latitude: 34.1463, longitude: 73.2119 },
      { name: "Dera Ismail Khan", nameUrdu: "ڈیرہ اسماعیل خان", latitude: 31.8311, longitude: 70.9017 },
      { name: "Nowshera", nameUrdu: "نوشہرہ", latitude: 34.0158, longitude: 71.9828 },
      { name: "Swat", nameUrdu: "سوات", latitude: 35.2227, longitude: 72.4258 },
      { name: "Chitral", nameUrdu: "چترال", latitude: 35.8518, longitude: 71.7864 },
      { name: "Mansehra", nameUrdu: "مانسہرہ", latitude: 34.3333, longitude: 73.2000 },
      { name: "Charsadda", nameUrdu: "چارسدہ", latitude: 34.1486, longitude: 71.7314 },
      { name: "Hangu", nameUrdu: "ہنگو", latitude: 33.5319, longitude: 71.0583 },
      { name: "Karak", nameUrdu: "کرک", latitude: 33.1167, longitude: 71.0833 },
      { name: "Lakki Marwat", nameUrdu: "لکی مروت", latitude: 32.6081, longitude: 70.9114 },
      { name: "Tank", nameUrdu: "ٹانک", latitude: 32.2167, longitude: 70.3833 },
      { name: "Timergara", nameUrdu: "تیمرگڑہ", latitude: 34.8297, longitude: 71.8442 },
      { name: "Parachinar", nameUrdu: "پاراچنار", latitude: 33.9017, longitude: 70.0719 },
      { name: "Miranshah", nameUrdu: "میران شاہ", latitude: 33.0000, longitude: 70.0667 },
      { name: "Wana", nameUrdu: "وانا", latitude: 32.3000, longitude: 69.5667 }
    ]
  },
  {
    name: "Balochistan",
    nameUrdu: "بلوچستان",
    cities: [
      { name: "Quetta", nameUrdu: "کوئٹہ", latitude: 30.1798, longitude: 66.9750 },
      { name: "Gwadar", nameUrdu: "گوادر", latitude: 25.1216, longitude: 62.3254 },
      { name: "Turbat", nameUrdu: "تربت", latitude: 26.0042, longitude: 63.0665 },
      { name: "Khuzdar", nameUrdu: "خضدار", latitude: 27.8094, longitude: 66.6114 },
      { name: "Chaman", nameUrdu: "چمن", latitude: 30.9236, longitude: 66.4502 },
      { name: "Hub", nameUrdu: "ہب", latitude: 25.0787, longitude: 66.7730 },
      { name: "Sibi", nameUrdu: "سبی", latitude: 29.5430, longitude: 67.8786 },
      { name: "Zhob", nameUrdu: "ژوب", latitude: 31.3417, longitude: 69.4500 },
      { name: "Loralai", nameUrdu: "لورالائی", latitude: 30.3704, longitude: 68.6020 },
      { name: "Mastung", nameUrdu: "مستونگ", latitude: 29.7997, longitude: 66.8456 },
      { name: "Kalat", nameUrdu: "قلات", latitude: 29.0269, longitude: 66.5906 },
      { name: "Pishin", nameUrdu: "پشین", latitude: 30.5833, longitude: 66.9833 },
      { name: "Lasbela", nameUrdu: "لسبیلہ", latitude: 26.2000, longitude: 66.1500 },
      { name: "Jaffarabad", nameUrdu: "جعفرآباد", latitude: 28.0225, longitude: 68.4378 },
      { name: "Nasirabad", nameUrdu: "نصیرآباد", latitude: 27.3833, longitude: 67.9167 },
      { name: "Dera Bugti", nameUrdu: "ڈیرہ بگٹی", latitude: 29.0333, longitude: 69.1500 },
      { name: "Kohlu", nameUrdu: "کوہلو", latitude: 29.8833, longitude: 69.2500 },
      { name: "Barkhan", nameUrdu: "برکھان", latitude: 29.8833, longitude: 69.5167 },
      { name: "Musakhel", nameUrdu: "موسیٰ خیل", latitude: 30.8667, longitude: 69.8833 },
      { name: "Ziarat", nameUrdu: "زیارت", latitude: 30.3817, longitude: 67.7256 }
    ]
  },
  {
    name: "Islamabad Capital Territory",
    nameUrdu: "وفاقی دارالحکومت اسلام آباد",
    cities: [
      { name: "Islamabad", nameUrdu: "اسلام آباد", latitude: 33.7294, longitude: 73.0931 }
    ]
  },
  {
    name: "Azad Kashmir",
    nameUrdu: "آزاد جموں و کشمیر",
    cities: [
      { name: "Muzaffarabad", nameUrdu: "مظفرآباد", latitude: 34.3707, longitude: 73.4713 },
      { name: "Mirpur", nameUrdu: "میرپور", latitude: 33.1507, longitude: 73.7516 },
      { name: "Kotli", nameUrdu: "کوٹلی", latitude: 33.5144, longitude: 73.9076 },
      { name: "Rawalakot", nameUrdu: "راولاکوٹ", latitude: 33.8581, longitude: 73.7598 },
      { name: "Palandri", nameUrdu: "پلندری", latitude: 33.7114, longitude: 73.6908 },
      { name: "Bhimber", nameUrdu: "بھمبر", latitude: 32.9742, longitude: 74.0789 },
      { name: "Bagh", nameUrdu: "باغ", latitude: 33.9833, longitude: 73.7833 },
      { name: "Sudhnoti", nameUrdu: "سدھنوتی", latitude: 33.6167, longitude: 73.6500 },
      { name: "Neelum", nameUrdu: "نیلم", latitude: 34.5833, longitude: 74.0167 },
      { name: "Hattian", nameUrdu: "ہٹیاں", latitude: 34.2167, longitude: 73.6167 }
    ]
  },
  {
    name: "Gilgit-Baltistan",
    nameUrdu: "گلگت بلتستان",
    cities: [
      { name: "Gilgit", nameUrdu: "گلگت", latitude: 35.9197, longitude: 74.3079 },
      { name: "Skardu", nameUrdu: "سکردو", latitude: 35.2971, longitude: 75.6333 },
      { name: "Hunza", nameUrdu: "ہنزہ", latitude: 36.3167, longitude: 74.6500 },
      { name: "Chilas", nameUrdu: "چلاس", latitude: 35.4167, longitude: 74.0833 },
      { name: "Ghanche", nameUrdu: "غانچے", latitude: 35.4167, longitude: 76.0833 },
      { name: "Astore", nameUrdu: "آسٹور", latitude: 35.3667, longitude: 74.9000 },
      { name: "Diamer", nameUrdu: "دیامر", latitude: 35.5167, longitude: 74.3833 },
      { name: "Ghizer", nameUrdu: "غذر", latitude: 36.1667, longitude: 73.6500 },
      { name: "Nagar", nameUrdu: "نگر", latitude: 36.1833, longitude: 74.4833 },
      { name: "Khaplu", nameUrdu: "کھپلو", latitude: 35.1406, longitude: 76.3372 }
    ]
  }
];