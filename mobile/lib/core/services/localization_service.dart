import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageModel {
  final String code;
  final String name;
  final String nativeName;
  final String flag;

  const LanguageModel({
    required this.code,
    required this.name,
    required this.nativeName,
    required this.flag,
  });
}

class LocalizationService extends ChangeNotifier {
  static const String _prefKey = 'pswms_mobile_lang';

  String _currentLanguage = 'en';
  String get currentLanguage => _currentLanguage;

  static const List<LanguageModel> supportedLanguages = [
    LanguageModel(code: 'en', name: 'English', nativeName: 'English', flag: '🇮🇳'),
    LanguageModel(code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳'),
    LanguageModel(code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳'),
    LanguageModel(code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳'),
    LanguageModel(code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳'),
  ];

  LocalizationService() {
    _loadSavedLanguage();
  }

  Future<void> _loadSavedLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_prefKey);
    if (saved != null && _translations.containsKey(saved)) {
      _currentLanguage = saved;
      notifyListeners();
    }
  }

  Future<void> setLanguage(String code) async {
    if (_translations.containsKey(code) && code != _currentLanguage) {
      _currentLanguage = code;
      notifyListeners();
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_prefKey, code);
    }
  }

  LanguageModel get currentLanguageModel {
    return supportedLanguages.firstWhere(
      (l) => l.code == _currentLanguage,
      orElse: () => supportedLanguages.first,
    );
  }

  String t(String key, [String? fallback]) {
    final currentMap = _translations[_currentLanguage];
    if (currentMap != null && currentMap.containsKey(key)) {
      return currentMap[key]!;
    }
    final enMap = _translations['en'];
    if (enMap != null && enMap.containsKey(key)) {
      return enMap[key]!;
    }
    return fallback ?? key;
  }

  static const Map<String, Map<String, String>> _translations = {
    'en': {
      'app_title': 'SOLDIER PULSE',
      'jai_hind': 'Jai Hind',
      'welcome_subtitle': 'Biological recovery, field telemetry & AI health cockpit.',
      'dashboard': 'Dashboard',
      'checkin': 'Check-in',
      'screen_time': 'Screen Time',
      'dossier': 'Dossier',
      'emergency_sos': 'EMERGENCY SOS',
      'sos_active': 'SOS Active',
      'wellness_score': 'Wellness Score',
      'combat_fit': 'Combat Fit',
      'sleep_restoration': 'Sleep Restoration',
      'fatigue_burnout': 'Fatigue & Burnout',
      'duty_days': 'Consecutive Duty',
      'tactical_breathing': 'Tactical Box Breathing (4-4-4-4)',
      'breathing_subtitle': 'Mil-spec autonomic nervous system regulation.',
      'inhale': 'Inhale Deep (4s)',
      'hold': 'Hold Full (4s)',
      'exhale': 'Exhale Smooth (4s)',
      'pause': 'Hold Empty (4s)',
      'start_breathing': 'Start Breathing',
      'stop_breathing': 'Pause',
      'daily_water': 'Hydration Target',
      'log_pulse': 'Log 24h Field Pulse',
      'medical_privilege_title': 'Article 42-A Medical Confidentiality Active',
      'medical_privilege_sub': 'Legal non-punitive safe harbor. Psychometric and emotional responses protected from ACR/APAR.',
      'transparency_matrix': 'Transparency Matrix',
      'language_select': 'Regional Language / भाषा',
    },
    'hi': {
      'app_title': 'सैनिक पल्स',
      'jai_hind': 'जय हिंद',
      'welcome_subtitle': 'शारीरिक सुधार, फील्ड टेलीमेट्री और एआई स्वास्थ्य कॉकपिट।',
      'dashboard': 'डैशबोर्ड',
      'checkin': 'चेक-इन',
      'screen_time': 'स्क्रीन टाइम',
      'dossier': 'डोजियर',
      'emergency_sos': 'आपातकालीन सहायता (SOS)',
      'sos_active': 'आपातकाल सक्रिय',
      'wellness_score': 'कल्याण स्कोर',
      'combat_fit': 'युद्ध हेतु सक्षम',
      'sleep_restoration': 'नींद की बहाली',
      'fatigue_burnout': 'थकान एवं बर्नआउट',
      'duty_days': 'लगातार ड्यूटी दिवस',
      'tactical_breathing': 'सामरिक बॉक्स श्वास नियमन (4-4-4-4)',
      'breathing_subtitle': 'मानसिक शांति और सतर्कता हेतु सैन्य श्वास व्यायाम।',
      'inhale': 'गहरी सांस लें (4 से.)',
      'hold': 'सांस रोकें (4 से.)',
      'exhale': 'सांस छोड़ें (4 से.)',
      'pause': 'विश्राम दें (4 से.)',
      'start_breathing': 'श्वास व्यायाम शुरू करें',
      'stop_breathing': 'रोकें',
      'daily_water': 'दैनिक जल सेवन लक्ष्य',
      'log_pulse': '24 घंटे का पल्स दर्ज करें',
      'medical_privilege_title': 'अनुच्छेद 42-ए चिकित्सा गोपनीयता सक्रिय',
      'medical_privilege_sub': 'दंडात्मक कार्रवाई रहित सुरक्षित क्षेत्र। मनोवैज्ञानिक डेटा वार्षिक रिपोर्ट (APAR) से बाहर है।',
      'transparency_matrix': 'पारदर्शिता मैट्रिक्स',
      'language_select': 'क्षेत्रीय भाषा / Language',
    },
    'pa': {
      'app_title': 'ਸੋਲਜਰ ਪਲਸ',
      'jai_hind': 'ਜੈ ਹਿੰਦ',
      'welcome_subtitle': 'ਸਰੀਰਕ ਰਿਕਵਰੀ, ਫੀਲਡ ਟੈਲੀਮੈਟਰੀ ਅਤੇ ਏਆਈ ਸਿਹਤ ਕਾਕਪਿਟ।',
      'dashboard': 'ਡੈਸ਼ਬੋਰਡ',
      'checkin': 'ਚੈੱਕ-ਇਨ',
      'screen_time': 'ਸਕ੍ਰੀਨ ਸਮਾਂ',
      'dossier': 'ਡੋਜ਼ੀਅਰ',
      'emergency_sos': 'ਐਮਰਜੈਂਸੀ ਅਲਰਟ (SOS)',
      'sos_active': 'ਐਮਰਜੈਂਸੀ ਚਾਲੂ',
      'wellness_score': 'ਵੈਲਨੈੱਸ ਸਕੋਰ',
      'combat_fit': 'ਮਿਸ਼ਨ ਲਈ ਫਿੱਟ',
      'sleep_restoration': 'ਨੀਂਦ ਦੀ ਬਹਾਲੀ',
      'fatigue_burnout': 'ਥਕਾਵਟ ਸੂਚਕਾਂਕ',
      'duty_days': 'ਲਗਾਤਾਰ ਡਿਊਟੀ ਦੇ ਦਿਨ',
      'tactical_breathing': 'ਸੈਨਿਕ ਬਾਕਸ ਸਾਹ ਪ੍ਰੋਟੋਕੋਲ (4-4-4-4)',
      'breathing_subtitle': 'ਤਣਾਅ ਕੰਟਰੋਲ ਲਈ ਵਿਸ਼ੇਸ਼ ਸਾਹ ਅਭਿਆਸ।',
      'inhale': 'ਸਾਹ ਅੰਦਰ ਲਵੋ (4s)',
      'hold': 'ਰੋਕ ਕੇ ਰੱਖੋ (4s)',
      'exhale': 'ਸਾਹ ਬਾਹਰ ਛੱਡੋ (4s)',
      'pause': 'ਵਿਰਾਮ ਲਵੋ (4s)',
      'start_breathing': 'ਸ਼ੁਰੂ ਕਰੋ',
      'stop_breathing': 'ਰੋਕੋ',
      'daily_water': 'ਪਾਣੀ ਦਾ ਟੀਚਾ',
      'log_pulse': '24 ਘੰਟੇ ਦਾ ਪਲਸ ਦਰਜ ਕਰੋ',
      'medical_privilege_title': 'ਆਰਟੀਕਲ 42-ਏ ਮੈਡੀਕਲ ਗੁਪਤਤਾ ਸਰਗਰਮ',
      'medical_privilege_sub': 'ਕਾਨੂੰਨੀ ਗੁਪਤਤਾ। ਮਨੋਵਿਗਿਆਨਕ ਡਾਟਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਅਤ ਹੈ।',
      'transparency_matrix': 'ਗੁਪਤਤਾ ਮੈਟ੍ਰਿਕਸ',
      'language_select': 'ਖੇਤਰੀ ਭਾਸ਼ਾ',
    },
    'bn': {
      'app_title': 'সোলজার পালস',
      'jai_hind': 'জয় হিন্দ',
      'welcome_subtitle': 'শারীরিক পুনরুদ্ধার ও এআই স্বাস্থ্য ককপিট।',
      'dashboard': 'ড্যাশবোর্ড',
      'checkin': 'চেক-ইন',
      'screen_time': 'স্ক্রিন টাইম',
      'dossier': 'ডসিয়ার',
      'emergency_sos': 'জরুরী এসওএস (SOS)',
      'sos_active': 'এসওএস সক্রিয়',
      'wellness_score': 'সুস্থতা স্কোর',
      'combat_fit': 'মিশনের জন্য প্রস্তুত',
      'sleep_restoration': 'ঘুমের পুনরুদ্ধার',
      'fatigue_burnout': 'ক্লান্তি সূচক',
      'duty_days': 'একটানা দায়িত্বের দিন',
      'tactical_breathing': 'ট্যাকটিক্যাল বক্স শ্বাস-প্রশ্বাস (4-4-4-4)',
      'breathing_subtitle': 'মানসিক চাপ নিয়ন্ত্রণে সামরিক শ্বাস-প্রশ্বাস পদ্ধতি।',
      'inhale': 'শ্বাস নিন (৪ সে.)',
      'hold': 'ধরে রাখুন (৪ সে.)',
      'exhale': 'শ্বাস ছাড়ুন (৪ সে.)',
      'pause': 'বিরতি দিন (৪ সে.)',
      'start_breathing': 'শুরু করুন',
      'stop_breathing': 'থামান',
      'daily_water': 'জল পানের লক্ষ্য',
      'log_pulse': '২৪ ঘণ্টার পালস নথিভুক্ত করুন',
      'medical_privilege_title': 'অনুচ্ছেদ ৪২-এ চিকিৎসা গোপনীয়তা সক্রিয়',
      'medical_privilege_sub': 'সম্পূর্ণ আইনি সুরক্ষিত চিকিৎসা রেকর্ড।',
      'transparency_matrix': 'স্বচ্ছতা ম্যাট্রিক্স',
      'language_select': 'আঞ্চলিক ভাষা',
    },
    'ta': {
      'app_title': 'சோல்ஜர் பல்ஸ்',
      'jai_hind': 'ஜெய் ஹிந்த்',
      'welcome_subtitle': 'உடல்நிலை மீட்பு மற்றும் ஏஐ சுகாதார மையம்.',
      'dashboard': 'டாஷ்போர்டு',
      'checkin': 'செக்-இன்',
      'screen_time': 'திரை நேரம்',
      'dossier': 'ஆவணம்',
      'emergency_sos': 'அவசர உதவி (SOS)',
      'sos_active': 'அவசர எச்சரிக்கை',
      'wellness_score': 'நல்வாழ்வு மதிப்பு',
      'combat_fit': 'போருக்குத் தயார்',
      'sleep_restoration': 'தூக்க மீட்பு',
      'fatigue_burnout': 'சோர்வு நிலை',
      'duty_days': 'தொடர் பணி நாட்கள்',
      'tactical_breathing': 'பாக்ஸ் சுவாசப் பயிற்சி (4-4-4-4)',
      'breathing_subtitle': 'மன அழுத்தத்தைக் குறைக்கும் இராணுவ மூச்சுப் பயிற்சி.',
      'inhale': 'மூச்சை இழுக்கவும் (4s)',
      'hold': 'அடக்கவும் (4s)',
      'exhale': 'வெளியே விடவும் (4s)',
      'pause': 'இடைவெளி (4s)',
      'start_breathing': 'தொடங்கவும்',
      'stop_breathing': 'நிறுத்தவும்',
      'daily_water': 'தண்ணீர் இலக்கு',
      'log_pulse': '24 மணி நேர பதிவைச் சேர்க்கவும்',
      'medical_privilege_title': 'பிரிவு 42-ஏ மருத்துவ ரகசியத்தன்மை',
      'medical_privilege_sub': 'தண்டனையற்ற சட்டரீதியான பாதுகாப்பு.',
      'transparency_matrix': 'வெளிப்படைத்தன்மை மேட்ரிக்ஸ்',
      'language_select': 'பிராந்திய மொழி',
    },
  };
}
