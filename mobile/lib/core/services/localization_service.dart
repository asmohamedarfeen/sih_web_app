import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../localization/assessment_translations.dart';
import '../localization/mobile_translations.dart';

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
    LanguageModel(code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳'),
    LanguageModel(code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳'),
    LanguageModel(code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳'),
    LanguageModel(code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳'),
    LanguageModel(code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳'),
    LanguageModel(code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳'),
  ];

  LocalizationService() {
    _loadSavedLanguage();
  }

  Future<void> _loadSavedLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_prefKey);
    if (saved != null && (_translations.containsKey(saved) || MobileTranslations.translations.containsKey(saved))) {
      _currentLanguage = saved;
      notifyListeners();
    }
  }

  Future<void> setLanguage(String code) async {
    if ((_translations.containsKey(code) || MobileTranslations.translations.containsKey(code)) && code != _currentLanguage) {
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

  String t(String keyOrPhrase, [String? fallback]) {
    // 1. Check MobileTranslations first (rich military, section and phrase dictionary)
    final mobileResult = MobileTranslations.lookup(_currentLanguage, keyOrPhrase, null);
    if (mobileResult != keyOrPhrase) {
      return mobileResult;
    }

    // 2. Check local _translations dictionary
    final currentMap = _translations[_currentLanguage];
    if (currentMap != null && currentMap.containsKey(keyOrPhrase)) {
      return currentMap[keyOrPhrase]!;
    }
    final enMap = _translations['en'];
    if (enMap != null && enMap.containsKey(keyOrPhrase)) {
      return enMap[keyOrPhrase]!;
    }

    return fallback ?? keyOrPhrase;
  }

  // --- Psychological Self-Assessment Localization Helpers ---

  List<String> getStandardizedOptions() {
    return AssessmentTranslations.standardizedOptions[_currentLanguage] ??
        AssessmentTranslations.standardizedOptions['en']!;
  }

  String translateQuestion(String questionId, [String? fallback]) {
    final qMap = AssessmentTranslations.questions[questionId];
    if (qMap != null) {
      return qMap[_currentLanguage] ?? qMap['en'] ?? fallback ?? questionId;
    }
    return fallback ?? questionId;
  }

  String translateDomain(String domainId, [String? fallback]) {
    final dMap = AssessmentTranslations.domainNames[domainId];
    if (dMap != null) {
      return dMap[_currentLanguage] ?? dMap['en'] ?? fallback ?? domainId;
    }
    return fallback ?? domainId;
  }

  String assessmentUi(String key, [String? fallback]) {
    final uiMap = AssessmentTranslations.ui[key];
    if (uiMap != null) {
      return uiMap[_currentLanguage] ?? uiMap['en'] ?? fallback ?? key;
    }
    return fallback ?? key;
  }

  static const Map<String, Map<String, String>> _translations = {
    'en': {
      'app_title': 'SOLDIER PULSE',
      'jai_hind': 'Jai Hind',
      'welcome_subtitle': 'Biological recovery, field telemetry & health cockpit.',
      'dashboard': 'Dashboard',
      'checkin': 'Check-in',
      'screen_time': 'Screen Time',
      'dossier': 'Dossier',
      'self_assessment': 'Self-Assessment',
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
      'welcome_subtitle': 'शारीरिक सुधार, फील्ड टेलीमेट्री और स्वास्थ्य कॉकपिट।',
      'dashboard': 'डैशबोर्ड',
      'checkin': 'चेक-इन',
      'screen_time': 'स्क्रीन टाइम',
      'dossier': 'डोजियर',
      'self_assessment': 'आत्म-मूल्यांकन',
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
      'welcome_subtitle': 'ਸਰੀਰਕ ਰਿਕਵਰੀ, ਫੀਲਡ ਟੈਲੀਮੈਟਰੀ ਅਤੇ ਸਿਹਤ ਕਾਕਪਿਟ।',
      'dashboard': 'ਡੈਸ਼ਬੋਰਡ',
      'checkin': 'ਚੈੱਕ-ਇਨ',
      'screen_time': 'ਸਕ੍ਰੀਨ ਸਮਾਂ',
      'dossier': 'ਡੋਜ਼ੀਅਰ',
      'self_assessment': 'ਸਵੈ-ਮੁਲਾਂਕਣ',
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
      'welcome_subtitle': 'শারীরিক পুনরুদ্ধার ও স্বাস্থ্য ককপিট।',
      'dashboard': 'ড্যাশবোর্ড',
      'checkin': 'চেক-ইন',
      'screen_time': 'স্ক্রিন টাইম',
      'dossier': 'ডসিয়ার',
      'self_assessment': 'আত্ম-মূল্যায়ন',
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
      'welcome_subtitle': 'உடல்நிலை மீட்பு மற்றும் சுகாதார மையம்.',
      'dashboard': 'டாஷ்போர்டு',
      'checkin': 'செக்-இன்',
      'screen_time': 'திரை நேரம்',
      'dossier': 'ஆவணம்',
      'self_assessment': 'சுய மதிப்பீடு',
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
    'te': {
      'app_title': 'సోల్జర్ పల్స్',
      'jai_hind': 'జై హింద్',
      'welcome_subtitle': 'శారీరక స్వస్థత, ఫీల్డ్ టెలిమెట్రీ మరియు ఆరోగ్య కాక్‌పిట్.',
      'dashboard': 'డ్యాష్‌బోర్డ్',
      'checkin': 'చెకిన్',
      'screen_time': 'స్క్రీన్ సమయం',
      'dossier': 'డోసియర్',
      'self_assessment': 'స్వీయ మూల్యాంకనం',
      'emergency_sos': 'అత్యవసర సహాయం (SOS)',
      'sos_active': 'అత్యవసర హెచ్చరిక',
      'wellness_score': 'వెల్‌నెస్ స్కోరు',
      'combat_fit': 'యుద్ధానికి సిద్ధం',
      'sleep_restoration': 'నిద్ర స్వస్థత',
      'fatigue_burnout': 'అలసట & బర్న్‌అవుట్',
      'duty_days': 'నిరంతర విధి రోజులు',
      'tactical_breathing': 'టాక్టికల్ బాక్స్ శ్వాస నియంత్రణ (4-4-4-4)',
      'breathing_subtitle': 'ఒత్తిడి నియంత్రణ మరియు మానసిక ప్రశాంతత కోసం సైనిక శ్వాస ప్రక్రియ.',
      'inhale': 'దీర్ఘంగా శ్వాస తీసుకోండి (4సెం)',
      'hold': 'బిగబట్టండి (4సెం)',
      'exhale': 'శ్వాస వదలండి (4సెం)',
      'pause': 'విరామం ఇవ్వండి (4సెం)',
      'start_breathing': 'శ్వాస వ్యాయామం ప్రారంభించండి',
      'stop_breathing': 'నిలిపివేయండి',
      'daily_water': 'నీటి లక్ష్యం',
      'log_pulse': '24 గంటల పల్స్ నమోదు చేయండి',
      'medical_privilege_title': 'ఆర్టికల్ 42-ఎ వైద్య గోప్యత చురుకుగా ఉంది',
      'medical_privilege_sub': 'శిక్షారహిత చట్టపరమైన రక్షణ. మానసిక డేటా అధికారిక నివేదికల నుండి రక్షించబడింది.',
      'transparency_matrix': 'పారదర్శకత మాత్రిక',
      'language_select': 'ప్రాంతీయ భాష / Language',
    },
    'mr': {
      'app_title': 'सोल्जर पल्स',
      'jai_hind': 'जय हिंद',
      'welcome_subtitle': 'शारीरिक सुधारणा, फील्ड टेलिमेट्री आणि आरोग्य कॉकपिट.',
      'dashboard': 'डॅशबोर्ड',
      'checkin': 'चेक-इन',
      'screen_time': 'स्क्रीन वेळ',
      'dossier': 'डॉसियर',
      'self_assessment': 'स्व-मूल्यांकन',
      'emergency_sos': 'आपत्कालीन मदत (SOS)',
      'sos_active': 'आपत्कालीन सक्रिय',
      'wellness_score': 'आरोग्य स्कोअर',
      'combat_fit': 'मोहिमेसाठी सज्ज',
      'sleep_restoration': 'झोपेची पुनर्प्राप्ती',
      'fatigue_burnout': 'थकवा आणि बर्नआउट',
      'duty_days': 'सलग ड्युटी दिवस',
      'tactical_breathing': 'सामरिक बॉक्स श्वासोच्छ्वास (4-4-4-4)',
      'breathing_subtitle': 'मानसिक शांतता व सतर्कतेसाठी लष्करी श्वासोच्छ्वास व्यायाम.',
      'inhale': 'दीर्घ श्वास घ्या (४ से.)',
      'hold': 'श्वास रोखा (४ से.)',
      'exhale': 'श्वास सोडा (४ से.)',
      'pause': 'विश्रांती घ्या (४ से.)',
      'start_breathing': 'श्वास व्यायाम सुरू करा',
      'stop_breathing': 'थांबवा',
      'daily_water': 'दैनिक पाणी सेवन लक्ष्य',
      'log_pulse': '२४ तासांचा पल्स नोंदवा',
      'medical_privilege_title': 'अनुच्छेद ४२-ए वैद्यकीय गोपनीयता सक्रिय',
      'medical_privilege_sub': 'शिक्षारहित कायदेशीर संरक्षण. मानसिक माहिती गोपनीय राहील.',
      'transparency_matrix': 'पारदर्शकता मॅट्रिक्स',
      'language_select': 'प्रादेशिक भाषा / Language',
    },
    'gu': {
      'app_title': 'સોલ્જર પલ્સ',
      'jai_hind': 'જય હિન્દ',
      'welcome_subtitle': 'શારીરિક સુધારો, ફીલ્ડ ટેલિમેટ્રી અને આરોગ્ય કોકપિટ.',
      'dashboard': 'ડેશબોર્ડ',
      'checkin': 'ચેક-ઇન',
      'screen_time': 'સ્ક્રીન સમય',
      'dossier': 'ડોઝિયર',
      'self_assessment': 'સ્વ-મૂલ્યાંકન',
      'emergency_sos': 'કટોકટી સહાય (SOS)',
      'sos_active': 'કટોકટી સક્રિય',
      'wellness_score': 'વેલનેસ સ્કોર',
      'combat_fit': 'લડાઇ માટે સક્ષમ',
      'sleep_restoration': 'ઊંઘની પુનઃપ્રાપ્તિ',
      'fatigue_burnout': 'થાક અને બર્નઆઉટ',
      'duty_days': 'સતત ફરજના દિવસો',
      'tactical_breathing': 'સૈન્ય બોક્સ શ્વાસ નિયમન (4-4-4-4)',
      'breathing_subtitle': 'માનસિક શાંતિ અને તણાવ નિયંત્રણ માટે ખાસ શ્વાસ વ્યાયામ.',
      'inhale': 'ઊંડો શ્વાસ લો (4 સે.)',
      'hold': 'શ્વાસ રોકો (4 સે.)',
      'exhale': 'શ્વાસ બહાર કાઢો (4 સે.)',
      'pause': 'વિરામ આપો (4 સે.)',
      'start_breathing': 'શ્વાસ વ્યાયામ શરૂ કરો',
      'stop_breathing': 'રોકો',
      'daily_water': 'દૈનિક પાણીનું લક્ષ્ય',
      'log_pulse': '24 કલાકનો પલ્સ નોંધો',
      'medical_privilege_title': 'અનુચ્છેદ 42-એ તબીબી ગુપ્તતા સક્રિય',
      'medical_privilege_sub': 'દંડાત્મક કાર્યવાહી વિનાનું કાનૂની રક્ષણ.',
      'transparency_matrix': 'પારદર્શિતા મેટ્રિક્સ',
      'language_select': 'પ્રાદેશિક ભાષા / Language',
    },
    'kn': {
      'app_title': 'ಸೋಲ್ಜರ್ ಪಲ್ಸ್',
      'jai_hind': 'ಜೈ ಹಿಂದ್',
      'welcome_subtitle': 'ದೈಹಿಕ ಚೇತರಿಕೆ, ಫೀಲ್ಡ್ ಟೆಲಿಮೆಟ್ರಿ ಮತ್ತು ಆರೋಗ್ಯ ಕಾಕ್‌ಪಿಟ್.',
      'dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      'checkin': 'ಚೆಕ್-ಇನ್',
      'screen_time': 'ಸ್ಕ್ರೀನ್ ಸಮಯ',
      'dossier': 'ದಾಖಲಾತಿ',
      'self_assessment': 'ಸ್ವಯಂ ಮೌಲ್ಯಮಾಪನ',
      'emergency_sos': 'ತುರ್ತು ಎಚ್ಚರಿಕೆ (SOS)',
      'sos_active': 'ತುರ್ತು ಸಕ್ರಿಯ',
      'wellness_score': 'ಕ್ಷೇಮ ಸ್ಕೋರ್',
      'combat_fit': 'ಕಾರ್ಯಾಚರಣೆಗೆ ಸಿದ್ಧ',
      'sleep_restoration': 'ನಿದ್ರೆಯ ಚೇತರಿಕೆ',
      'fatigue_burnout': 'ದೈಹಿಕ ಆಯಾಸ ಮತ್ತು ಬಳಲಿಕೆ',
      'duty_days': 'ನಿರಂತರ ಕರ್ತವ್ಯ ದಿನಗಳು',
      'tactical_breathing': 'ಸೈನಿಕ ಬಾಕ್ಸ್ ಉಸಿರಾಟ ಪ್ರೋಟೋಕಾಲ್ (4-4-4-4)',
      'breathing_subtitle': 'ಒತ್ತಡ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ ಮಿಲಿಟರಿ ಶೈಲಿಯ ಉಸಿರಾಟ ಅಭ್ಯಾಸ.',
      'inhale': 'ಉಸಿರನ್ನು ಎಳೆದುಕೊಳ್ಳಿ (4ಸೆ)',
      'hold': 'ಉಸಿರನ್ನು ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳಿ (4ಸೆ)',
      'exhale': 'ಉಸಿರನ್ನು ಹೊರಹಾಕಿ (4ಸೆ)',
      'pause': 'ವಿರಾಮ (4ಸೆ)',
      'start_breathing': 'ಉಸಿರಾಟ ಅಭ್ಯಾಸ ಪ್ರಾರಂಭಿಸಿ',
      'stop_breathing': 'ನಿಲ್ಲಿಸಿ',
      'daily_water': 'ದೈನಂದಿನ ನೀರಿನ ಗುರಿ',
      'log_pulse': '24 ಗಂಟೆಗಳ ಪಲ್ಸ್ ದಾಖಲಿಸಿ',
      'medical_privilege_title': 'ವಿಧಿ 42-ಎ ವೈದ್ಯಕೀಯ ಗೌಪ್ಯತೆ ಸಕ್ರಿಯವಾಗಿದೆ',
      'medical_privilege_sub': 'ಶಿಕ್ಷಾರಹಿತ ಕಾನೂನು ರಕ್ಷಣೆ. ಮಾನಸಿಕ ಡೇಟಾ ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತ.',
      'transparency_matrix': 'ಪಾರದರ್ಶಕತೆ ಮ್ಯಾಟ್ರಿಕ್ಸ್',
      'language_select': 'ಪ್ರಾದೇಶಿಕ ಭಾಷೆ / Language',
    },
    'ml': {
      'app_title': 'സോൾജർ പൾസ്',
      'jai_hind': 'ജയ് ഹിന്ദ്',
      'welcome_subtitle': 'ശാരീരിക വീണ്ടെടുക്കൽ, ഫീൽഡ് ടെലിമെട്രി & ഹെൽത്ത് കോക്ക്പിറ്റ്.',
      'dashboard': 'ഡാഷ്‌ബോർഡ്',
      'checkin': 'ചെക്ക്-ഇൻ',
      'screen_time': 'സ്ക്രീൻ സമയം',
      'dossier': 'ഡോസിയർ',
      'self_assessment': 'സ്വയം വിലയിരുത്തൽ',
      'emergency_sos': 'അടിയന്തര സഹായം (SOS)',
      'sos_active': 'അടിയന്തരാവസ്ഥ സജീവം',
      'wellness_score': 'വെൽനസ് സ്കോർ',
      'combat_fit': 'ദൗത്യത്തിന് സജ്ജം',
      'sleep_restoration': 'ഉറക്ക വീണ്ടെടുക്കൽ',
      'fatigue_burnout': 'ക്ഷീണവും തളർച്ചയും',
      'duty_days': 'തുടർച്ചയായ ജോലി ദിനങ്ങൾ',
      'tactical_breathing': 'ടാക്റ്റിക്കൽ ബോക്സ് ശ്വസന രീതി (4-4-4-4)',
      'breathing_subtitle': 'മാനസിക സമ്മർദ്ദം നിയന്ത്രിക്കുന്നതിനുള്ള സൈനിക ശ്വസന വ്യായാമം.',
      'inhale': 'ദീർഘമായി ശ്വാസമെടുക്കുക (4സെ)',
      'hold': 'ശ്വാസം അടക്കിപ്പിടിക്കുക (4സെ)',
      'exhale': 'ശ്വാസം പുറത്തുവിടുക (4സെ)',
      'pause': 'വിശ്രമം (4സെ)',
      'start_breathing': 'ശ്വസന വ്യായാമം ആരംഭിക്കുക',
      'stop_breathing': 'നിർത്തുക',
      'daily_water': 'കുടിവെള്ള ലക്ഷ്യം',
      'log_pulse': '24 മണിക്കൂർ പൾസ് രേഖപ്പെടുത്തുക',
      'medical_privilege_title': 'ആർട്ടിക്കിൾ 42-എ മെഡിക്കൽ രഹസ്യാത്മകത സജീവം',
      'medical_privilege_sub': 'ശിക്ഷാരഹിതമായ നിയമപരമായ പരിരക്ഷ. മാനസികാവസ്ഥ രേഖകൾ പൂർണ്ണമായും സുരക്ഷിതമാണ്.',
      'transparency_matrix': 'സുതാര്യത മാട്രിക്സ്',
      'language_select': 'പ്രാദേശിക ഭാഷ / Language',
    },
    'or': {
      'app_title': 'ସୋଲଜର ପଲ୍ସ',
      'jai_hind': 'ଜୟ ହିନ୍ଦ',
      'welcome_subtitle': 'ଶାରୀରିକ ସୁସ୍ଥତା, ଫିଲ୍ଡ ଟେଲିମେଟ୍ରି ଏବଂ ସ୍ୱାସ୍ଥ୍ୟ କକ୍‌ପିଟ୍।',
      'dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
      'checkin': 'ଚେକ୍-ଇନ୍',
      'screen_time': 'ସ୍କ୍ରିନ୍ ସମୟ',
      'dossier': 'ଡୋସିୟର',
      'self_assessment': 'ଆତ୍ମ-ମୂଲ୍ୟାଙ୍କନ',
      'emergency_sos': 'ଜରୁରୀକାଳୀନ ସହାୟତା (SOS)',
      'sos_active': 'ଜରୁରୀ ସକ୍ରିୟ',
      'wellness_score': 'ୱେଲନେସ୍ ସ୍କୋର',
      'combat_fit': 'ଯୁଦ୍ଧ ପାଇଁ ପ୍ରସ୍ତୁତ',
      'sleep_restoration': 'ନିଦ୍ରା ପୁନରୁଦ୍ଧାର',
      'fatigue_burnout': 'ଶାରୀରିକ କ୍ଳାନ୍ତି ଓ ଅବସାଦ',
      'duty_days': 'କ୍ରମାଗତ ଡ୍ୟୁଟି ଦିବସ',
      'tactical_breathing': 'ସାମରିକ ବକ୍ସ ଶ୍ୱାସକ୍ରିୟା (4-4-4-4)',
      'breathing_subtitle': 'ମାନସିକ ଶାନ୍ତି ଓ ସତର୍କତା ପାଇଁ ଶ୍ୱାସ ପ୍ରଶ୍ୱାସ ବ୍ୟାୟାମ।',
      'inhale': 'ଗଭୀର ଶ୍ୱାସ ନିଅନ୍ତୁ (୪ ସେ.)',
      'hold': 'ଧରି ରଖନ୍ତୁ (୪ ସେ.)',
      'exhale': 'ଶ୍ୱାସ ଛାଡ଼ନ୍ତୁ (୪ ସେ.)',
      'pause': 'ବିରାମ ଦିଅନ୍ତୁ (୪ ସେ.)',
      'start_breathing': 'ବ୍ୟାୟାମ ଆରମ୍ଭ କରନ୍ତୁ',
      'stop_breathing': 'ବନ୍ଦ କରନ୍ତୁ',
      'daily_water': 'ଦୈନିକ ଜଳପାନ ଲକ୍ଷ୍ୟ',
      'log_pulse': '୨୪ ଘଣ୍ଟାର ପଲ୍ସ ପଞ୍ଜୀକରଣ କରନ୍ତୁ',
      'medical_privilege_title': 'ଧାରା ୪୨-ଏ ଚିକିତ୍ସା ଗୋପନୀୟତା ସକ୍ରିୟ',
      'medical_privilege_sub': 'ଦଣ୍ଡମୁକ୍ତ ଆଇନଗତ ସୁରକ୍ଷା। ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ସମ୍ପୂର୍ଣ୍ଣ ସୁରକ୍ଷିତ।',
      'transparency_matrix': 'ସ୍ୱଚ୍ଛତା ମାଟ୍ରିକ୍ସ',
      'language_select': 'ଆଞ୍ଚଳିକ ଭାଷା / Language',
    },
  };
}
