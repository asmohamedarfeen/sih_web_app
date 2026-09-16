import { create } from 'zustand';

export type LanguageCode = 'en' | 'hi' | 'pa' | 'bn' | 'ta';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Top Bar & Navigation
    'defense_command': 'DEFENSE COMMAND',
    'app_title': 'Personnel Stress & Welfare Intelligence Command',
    'jai_hind': 'Jai Hind',
    'welcome_soldier': 'Your personal daily wellness cockpit. Track your biological recovery, log daily field telemetry, review AI health recommendations, and access tactical resilience protocols.',
    'personal_dashboard': 'Personal Dashboard',
    'daily_checkin': 'Daily Check-ins',
    'ai_health_insights': 'AI Health Insights',
    'recovery_activities': 'Recovery Activities',
    'my_alerts_sos': 'My Alerts & SOS',
    'my_service_record': 'My Service Record',
    'unit_hierarchy': 'Unit Hierarchy Tree',
    'sos_distress_alert': 'SOS Distress Alert',
    'sos_active': 'SOS Active (Command Alerted)',
    'record_daily_checkin': 'Record Daily Check-in',
    'form_16_dossier': 'Form 16 Dossier 🖨️',
    
    // Privacy Shield
    'article_42a_title': 'Article 42-A Defense Medical Privilege & Statutory Confidentiality Active',
    'non_punitive_badge': 'Non-Punitive Safe Harbor',
    'article_42a_desc': 'Your subjective emotional responses, survey choices, and psychological check-ins are legally classified as Privileged Medical Records. Encrypted (AES-256 GCM) and accessible ONLY to certified Medical Officers and Welfare Counselors.',
    'view_transparency_matrix': 'View Transparency Matrix',
    'hide_privacy_barrier': 'Hide Privacy Barrier',
    'what_doctors_see': 'What Certified Medical Officers See:',
    'what_commanders_see': 'What Your Unit Commander Sees (Masked):',
    
    // Check-in Form
    'checkin_heading': 'Daily Confidential Wellness Check-in',
    'checkin_sub': 'Record your 24h biological state. Data is analyzed confidentially by AI for burnout prevention.',
    'sleep_hours': 'Sleep Hours (Last 24h)',
    'mental_mood': 'Mental State / Mood',
    'fatigue_level': 'Fatigue Level',
    'workload_strain': 'Operational Workload',
    'musculoskeletal_strain': 'Musculoskeletal Strain',
    'duty_days_without_leave': 'Duty Days Without Leave',
    'confidential_notes': 'Confidential Field Observations / Sleep Disturbances (Optional)',
    'submit_checkin': 'Submit Daily Check-in',
    'syncing': 'Syncing...',
    'checkin_success': 'Daily Check-in registered successfully! Telemetry synchronized.',
    
    // Vitals & Scores
    'wellness_score_heading': 'Personal Wellness Score & Vitals',
    'combat_fit': 'Combat Fit',
    'optimal_status': 'OPTIMAL OPERATIONAL STATUS',
    'sleep_restoration': 'Sleep Restoration',
    'fatigue_burnout': 'Fatigue & Burnout Index',
    'physical_strain': 'Physical Strain',
    'consecutive_duty_days': 'Consecutive Operational Days',
    
    // Box Breathing
    'tactical_resilience': 'Tactical Stress Resilience Protocol & Box Breathing',
    'box_breathing_desc': 'Mil-spec 4-4-4-4 autonomic nervous system down-regulation for acute vigilance control.',
    'inhale': 'Inhale',
    'hold': 'Hold',
    'exhale': 'Exhale',
    'pause': 'Pause',
    'start_protocol': 'Start Breathing Cycle',
    'pause_protocol': 'Pause Cycle',
    'reset_protocol': 'Reset Protocol',
    
    // Hierarchy
    'corps_level': 'Corps Command',
    'division_level': 'Division Command',
    'brigade_level': 'Brigade Command',
    'battalion_level': 'Battalion Level',
    'company_level': 'Company Outpost',
    'section_drilldown': 'Chain of Command & Force Structure',
  },
  
  hi: {
    // Top Bar & Navigation
    'defense_command': 'रक्षा कमान',
    'app_title': 'सैनिक तनाव एवं कल्याण आसूचना कमान प्रणाली',
    'jai_hind': 'जय हिंद',
    'welcome_soldier': 'आपका व्यक्तिगत दैनिक कल्याण कॉकपिट। अपनी शारीरिक रिकवरी ट्रैक करें, दैनिक फील्ड टेलीमेट्री दर्ज करें, एआई स्वास्थ्य अनुशंसाएं देखें और सामरिक विश्राम प्रोटोकॉल तक पहुंचें।',
    'personal_dashboard': 'व्यक्तिगत डैशबोर्ड',
    'daily_checkin': 'दैनिक उपस्थिति व जांच',
    'ai_health_insights': 'एआई स्वास्थ्य अंतर्दृष्टि',
    'recovery_activities': 'पुनर्प्राप्ति गतिविधियाँ',
    'my_alerts_sos': 'मेरी आपातकालीन सूचनाएं (SOS)',
    'my_service_record': 'मेरा सेवा रिकॉर्ड',
    'unit_hierarchy': 'सैन्य इकाई पदानुक्रम वृक्ष',
    'sos_distress_alert': 'आपातकालीन संकट अलार्म (SOS)',
    'sos_active': 'आपातकाल सक्रिय (कमान को सूचित किया गया)',
    'record_daily_checkin': 'दैनिक चेक-इन दर्ज करें',
    'form_16_dossier': 'फॉर्म 16 कल्याण डोजियर 🖨️',
    
    // Privacy Shield
    'article_42a_title': 'अनुच्छेद 42-ए रक्षा चिकित्सा विशेषाधिकार एवं वैधानिक गोपनीयता सक्रिय',
    'non_punitive_badge': 'दंडात्मक कार्रवाई रहित सुरक्षित क्षेत्र',
    'article_42a_desc': 'आपकी आंतरिक भावनाएं, प्रतिक्रियाएं और मनोवैज्ञानिक चेक-इन कानूनी रूप से विशेषाधिकार प्राप्त मेडिकल रिकॉर्ड हैं। एईएस-256 द्वारा एन्क्रिप्टेड और केवल प्रमाणित सैन्य चिकित्सा अधिकारियों एवं कल्याण परामर्शदाताओं के लिए दृश्यमान।',
    'view_transparency_matrix': 'गोपनीयता और पारदर्शिता मैट्रिक्स देखें',
    'hide_privacy_barrier': 'गोपनीयता मैट्रिक्स छिपाएं',
    'what_doctors_see': 'सैन्य चिकित्सा अधिकारी क्या देख सकते हैं:',
    'what_commanders_see': 'कमांडिंग ऑफिसर क्या देखते हैं (केवल समग्र):',
    
    // Check-in Form
    'checkin_heading': 'दैनिक गोपनीय कल्याण चेक-इन',
    'checkin_sub': 'पिछले 24 घंटों की अपनी शारीरिक स्थिति दर्ज करें। यह डेटा बर्नआउट रोकथाम के लिए एआई द्वारा पूरी तरह गोपनीय रखा जाता है।',
    'sleep_hours': 'नींद के घंटे (विगत 24 घंटे)',
    'mental_mood': 'मानसिक स्थिति / मनोदशा',
    'fatigue_level': 'थकान का स्तर',
    'workload_strain': 'परिचालन कार्यभार',
    'musculoskeletal_strain': 'शारीरिक व मांसपेशियों का तनाव',
    'duty_days_without_leave': 'बिना छुट्टी के निरंतर ड्यूटी के दिन',
    'confidential_notes': 'गोपनीय फील्ड टिप्पणियां / नींद में व्यवधान (वैकल्पिक)',
    'submit_checkin': 'दैनिक चेक-इन जमा करें',
    'syncing': 'सिंक्रनाइज़ हो रहा है...',
    'checkin_success': 'दैनिक चेक-इन सफलतापूर्वक दर्ज हुआ! टेलीमेट्री डेटा सुरक्षित सिंक्रनाइज़ किया गया।',
    
    // Vitals & Scores
    'wellness_score_heading': 'व्यक्तिगत कल्याण स्कोर एवं महत्वपूर्ण जीवन संकेत',
    'combat_fit': 'युद्ध हेतु पूर्णतः सक्षम',
    'optimal_status': 'इष्टतम परिचालन स्थिति',
    'sleep_restoration': 'नींद की बहाली',
    'fatigue_burnout': 'थकान एवं बर्नआउट सूचकांक',
    'physical_strain': 'शारीरिक भार',
    'consecutive_duty_days': 'लगातार ड्यूटी के दिन',
    
    // Box Breathing
    'tactical_resilience': 'सामरिक तनाव लचीलापन प्रोटोकॉल (बॉक्स श्वास व्यायाम)',
    'box_breathing_desc': 'तीव्र सतर्कता और मानसिक तनाव नियमन हेतु 4-4-4-4 सेकंड का सैन्य श्वास नियमन।',
    'inhale': 'श्वास भीतर लें',
    'hold': 'रोक कर रखें',
    'exhale': 'श्वास बाहर छोड़ें',
    'pause': 'विश्राम दें',
    'start_protocol': 'श्वास चक्र प्रारंभ करें',
    'pause_protocol': 'चक्र रोकें',
    'reset_protocol': 'प्रोटोकॉल रीसेट करें',
    
    // Hierarchy
    'corps_level': 'कोर कमान मुख्यालय',
    'division_level': 'डिवीज़न कमान',
    'brigade_level': 'ब्रिगेड मुख्यालय',
    'battalion_level': 'बटालियन स्तर',
    'company_level': 'कंपनी फॉरवर्ड पोस्ट',
    'section_drilldown': 'सैन्य कमान श्रृंखला एवं बल संरचना',
  },

  pa: {
    // Punjabi
    'defense_command': 'ਰੱਖਿਆ ਕਮਾਂਡ',
    'app_title': 'ਜਵਾਨ ਤਣਾਅ ਅਤੇ ਭਲਾਈ ਇੰਟੈਲੀਜੈਂਸ ਕਮਾਂਡ ਸਿਸਟਮ',
    'jai_hind': 'ਜੈ ਹਿੰਦ',
    'welcome_soldier': 'ਤੁਹਾਡਾ ਨਿੱਜੀ ਰੋਜ਼ਾਨਾ ਭਲਾਈ ਕਾਕਪਿਟ। ਆਪਣੀ ਸਰੀਰਕ ਰਿਕਵਰੀ ਨੂੰ ਟਰੈਕ ਕਰੋ, ਰੋਜ਼ਾਨਾ ਫੀਲਡ ਟੈਲੀਮੈਟਰੀ ਦਰਜ ਕਰੋ ਅਤੇ ਤਣਾਅ-ਮੁਕਤੀ ਪ੍ਰੋਟੋਕੋਲ ਪ੍ਰਾਪਤ ਕਰੋ।',
    'personal_dashboard': 'ਨਿੱਜੀ ਡੈਸ਼ਬੋਰਡ',
    'daily_checkin': 'ਰੋਜ਼ਾਨਾ ਚੈੱਕ-ਇਨ',
    'ai_health_insights': 'ਏਆਈ ਸਿਹਤ ਸੂਝ',
    'recovery_activities': 'ਰਿਕਵਰੀ ਗਤੀਵਿਧੀਆਂ',
    'my_alerts_sos': 'ਮੇਰੇ ਐਮਰਜੈਂਸੀ ਅਲਰਟ (SOS)',
    'my_service_record': 'ਮੇਰਾ ਸੇਵਾ ਰਿਕਾਰਡ',
    'unit_hierarchy': 'ਯੂਨਿਟ ਲੜੀਵਾਰ ਢਾਂਚਾ ਰੁੱਖ',
    'sos_distress_alert': 'ਸੰਕਟਕਾਲੀਨ ਐਮਰਜੈਂਸੀ ਅਲਰਟ (SOS)',
    'sos_active': 'ਐਮਰਜੈਂਸੀ ਚਾਲੂ (ਕਮਾਂਡ ਨੂੰ ਸੂਚਿਤ ਕੀਤਾ ਗਿਆ)',
    'record_daily_checkin': 'ਰੋਜ਼ਾਨਾ ਚੈੱਕ-ਇਨ ਦਰਜ ਕਰੋ',
    'form_16_dossier': 'ਫਾਰਮ 16 ਭਲਾਈ ਡੋਜ਼ੀਅਰ 🖨️',
    
    'article_42a_title': 'ਆਰਟੀਕਲ 42-ਏ ਰੱਖਿਆ ਮੈਡੀਕਲ ਵਿਸ਼ੇਸ਼-ਅਧਿਕਾਰ ਅਤੇ ਕਾਨੂੰਨੀ ਗੁਪਤਤਾ ਸਰਗਰਮ',
    'non_punitive_badge': 'ਦੰਡ ਰਹਿਤ ਸੁਰੱਖਿਅਤ ਖੇਤਰ',
    'article_42a_desc': 'ਤੁਹਾਡੀਆਂ ਨਿੱਜੀ ਭਾਵਨਾਵਾਂ ਅਤੇ ਮਨੋਵਿਗਿਆਨਕ ਜਵਾਬ ਪੂਰੀ ਤਰ੍ਹਾਂ ਗੁਪਤ ਹਨ। ਏਈਐਸ-256 ਦੁਆਰਾ ਇਨਕ੍ਰਿਪਟਡ ਅਤੇ ਕੇਵਲ ਯੂਨਿਟ ਡਾਕਟਰਾਂ ਲਈ ਪਹੁੰਚਯੋਗ ਹਨ।',
    'view_transparency_matrix': 'ਗੁਪਤਤਾ ਮੈਟ੍ਰਿਕਸ ਵੇਖੋ',
    'hide_privacy_barrier': 'ਗੁਪਤਤਾ ਮੈਟ੍ਰਿਕਸ ਛੁਪਾਓ',
    'what_doctors_see': 'ਮੈਡੀਕਲ ਅਧਿਕਾਰੀ ਕੀ ਵੇਖਦੇ ਹਨ:',
    'what_commanders_see': 'ਕਮਾਂਡਿੰਗ ਅਫਸਰ ਕੀ ਵੇਖਦੇ ਹਨ (ਸਿਰਫ ਕੁੱਲ ਤਿਆਰੀ):',
    
    'checkin_heading': 'ਰੋਜ਼ਾਨਾ ਗੁਪਤ ਵੈਲਨੈੱਸ ਚੈੱਕ-ਇਨ',
    'checkin_sub': 'ਪਿਛਲੇ 24 ਘੰਟਿਆਂ ਦੀ ਆਪਣੀ ਸਰੀਰਕ ਸਥਿਤੀ ਦਰਜ ਕਰੋ।',
    'sleep_hours': 'ਨੀਂਦ ਦੇ ਘੰਟੇ (ਪਿਛਲੇ 24 ਘੰਟੇ)',
    'mental_mood': 'ਮਾਨਸਿਕ ਸਥਿਤੀ / ਮੂਡ',
    'fatigue_level': 'ਥਕਾਵਟ ਦਾ ਪੱਧਰ',
    'workload_strain': 'ਡਿਊਟੀ ਦਾ ਕੰਮਕਾਜੀ ਦਬਾਅ',
    'musculoskeletal_strain': 'ਸਰੀਰਕ ਖਿੱਚ / ਦਰਦ',
    'duty_days_without_leave': 'ਬਿਨਾਂ ਛੁੱਟੀ ਦੇ ਲਗਾਤਾਰ ਦਿਨ',
    'confidential_notes': 'ਗੁਪਤ ਫੀਲਡ ਟਿੱਪਣੀਆਂ (ਵਿਕਲਪਿਕ)',
    'submit_checkin': 'ਦੈਨਿਕ ਚੈੱਕ-ਇਨ ਜਮ੍ਹਾਂ ਕਰੋ',
    'syncing': 'ਸਿੰਕ ਹੋ ਰਿਹਾ ਹੈ...',
    'checkin_success': 'ਰੋਜ਼ਾਨਾ ਚੈੱਕ-ਇਨ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਹੋ ਗਿਆ!',
    
    'wellness_score_heading': 'ਨਿੱਜੀ ਵੈਲਨੈੱਸ ਸਕੋਰ ਅਤੇ ਜ਼ਰੂਰੀ ਸੰਕੇਤ',
    'combat_fit': 'ਮਿਸ਼ਨ ਲਈ ਫਿੱਟ',
    'optimal_status': 'ਸਭ ਤੋਂ ਉੱਤਮ ਸਥਿਤੀ',
    'sleep_restoration': 'ਨੀਂਦ ਦੀ ਬਹਾਲੀ',
    'fatigue_burnout': 'ਥਕਾਵਟ ਸੂਚਕਾਂਕ',
    'physical_strain': 'ਸਰੀਰਕ ਤਣਾਅ',
    'consecutive_duty_days': 'ਲਗਾਤਾਰ ਡਿਊਟੀ ਦੇ ਦਿਨ',
    
    'tactical_resilience': 'ਸੈਨਿਕ ਬਾਕਸ ਸਾਹ ਪ੍ਰੋਟੋਕੋਲ',
    'box_breathing_desc': '4-4-4-4 ਸਕਿੰਟ ਦਾ ਤਣਾਅ ਨਿਯੰਤਰਣ ਸਾਹ ਅਭਿਆਸ।',
    'inhale': 'ਸਾਹ ਅੰਦਰ ਖਿੱਚੋ',
    'hold': 'ਰੋਕ ਕੇ ਰੱਖੋ',
    'exhale': 'ਸਾਹ ਬਾਹਰ ਛੱਡੋ',
    'pause': 'ਵਿਰਾਮ ਲਵੋ',
    'start_protocol': 'ਚੱਕਰ ਸ਼ੁਰੂ ਕਰੋ',
    'pause_protocol': 'ਰੋਕੋ',
    'reset_protocol': 'ਦੁਬਾਰਾ ਸੈੱਟ ਕਰੋ',
    
    'corps_level': 'ਕੋਰ ਕਮਾਂਡ',
    'division_level': 'ਡਿਵੀਜ਼ਨ ਕਮਾਂਡ',
    'brigade_level': 'ਬ੍ਰਿਗੇਡ ਕਮਾਂਡ',
    'battalion_level': 'ਬਟਾਲੀਅਨ ਪੱਧਰ',
    'company_level': 'ਕੰਪਨੀ ਪੋਸਟ',
    'section_drilldown': 'ਫੌਜੀ ਲੜੀਵਾਰ ਢਾਂਚਾ',
  },

  bn: {
    // Bengali
    'defense_command': 'প্রতিরক্ষা কমান্ড',
    'app_title': 'সেনা মানসিক চাপ ও কল্যাণ বুদ্ধিমত্তা কমান্ড সিস্টেম',
    'jai_hind': 'জয় হিন্দ',
    'welcome_soldier': 'আপনার ব্যক্তিগত দৈনিক সুস্থতা ককপিট। আপনার শারীরিক পুনরুদ্ধার পর্যবেক্ষণ করুন এবং এআই স্বাস্থ্য নির্দেশিকা পান।',
    'personal_dashboard': 'ব্যক্তিগত ড্যাশবোর্ড',
    'daily_checkin': 'দৈনিক চেক-ইন',
    'ai_health_insights': 'এআই স্বাস্থ্য অন্তর্দৃষ্টি',
    'recovery_activities': 'পুনরুদ্ধার কার্যক্রম',
    'my_alerts_sos': 'জরুরী সতর্কতা (SOS)',
    'my_service_record': 'আমার পরিষেবা রেকর্ড',
    'unit_hierarchy': 'সামরিক পদক্রম কাঠামো বৃক্ষ',
    'sos_distress_alert': 'জরুরী এসওএস বিপদ সংকেত',
    'sos_active': 'এসওএস সক্রিয় (কমান্ডকে সতর্ক করা হয়েছে)',
    'record_daily_checkin': 'দৈনিক চেক-ইন নথিভুক্ত করুন',
    'form_16_dossier': 'ফর্ম ১৬ কল্যাণ ডসিয়ার 🖨️',
    
    'article_42a_title': 'অনুচ্ছেদ ৪২-এ প্রতিরক্ষা চিকিৎসা অধিকার ও সংবিধিবদ্ধ গোপনীয়তা সক্রিয়',
    'non_punitive_badge': 'শাস্তিমূলক ব্যবস্থা মুক্ত নিরাপদ আশ্রয়',
    'article_42a_desc': 'আপনার মানসিক অনুভূতি এবং স্বাস্থ্য চেক-ইন সম্পূর্ণ গোপনীয় এবং আইনি সুরক্ষিত চিকিৎসা রেকর্ড। এটি কেবল চিকিৎসকদের জন্য দৃশ্যমান।',
    'view_transparency_matrix': 'স্বচ্ছতা ম্যাট্রিক্স দেখুন',
    'hide_privacy_barrier': 'গোপনীয়তা ম্যাট্রিক্স লুকান',
    'what_doctors_see': 'চিকিৎসা কর্মকর্তারা যা দেখতে পারেন:',
    'what_commanders_see': 'কমান্ডিং অফিসার যা দেখেন (কেবল সার্বিক প্রস্তুতি):',
    
    'checkin_heading': 'দৈনিক গোপনীয় স্বাস্থ্য চেক-ইন',
    'checkin_sub': 'গত ২৪ ঘণ্টার শারীরিক অবস্থা নথিভুক্ত করুন।',
    'sleep_hours': 'ঘুমের সময়কাল (বিগত ২৪ ঘণ্টা)',
    'mental_mood': 'মানসিক অবস্থা / মেজাজ',
    'fatigue_level': 'ক্লান্তির মাত্রা',
    'workload_strain': 'অপারেশনাল কাজের চাপ',
    'musculoskeletal_strain': 'শারীরিক পেশীর চাপ',
    'duty_days_without_leave': 'ছুটি ছাড়া একটানা দায়িত্ব পালনের দিন',
    'confidential_notes': 'গোপনীয় ফিল্ড পর্যবেক্ষণ (ঐচ্ছিক)',
    'submit_checkin': 'দৈনিক চেক-ইন জমা দিন',
    'syncing': 'সিঙ্ক হচ্ছে...',
    'checkin_success': 'দৈনিক চেক-ইন সফলভাবে জমা হয়েছে!',
    
    'wellness_score_heading': 'ব্যক্তিগত সুস্থতা স্কোর ও গুরুত্বপূর্ণ সূচক',
    'combat_fit': 'মিশনের জন্য সম্পূর্ণ প্রস্তুত',
    'optimal_status': 'সর্বোত্তম অপারেশনাল অবস্থা',
    'sleep_restoration': 'ঘুমের পুনরুদ্ধার',
    'fatigue_burnout': 'ক্লান্তি সূচক',
    'physical_strain': 'শারীরিক ক্লান্তি',
    'consecutive_duty_days': 'টানা দায়িত্বের দিন',
    
    'tactical_resilience': 'ট্যাকটিক্যাল বক্স শ্বাস-প্রশ্বাস প্রোটোকল',
    'box_breathing_desc': 'মানসিক চাপ নিয়ন্ত্রণে ৪-৪-৪-৪ সেকেন্ডের সামরিক শ্বাস-প্রশ্বাস পদ্ধতি।',
    'inhale': 'শ্বাস গ্রহণ করুন',
    'hold': 'ধরে রাখুন',
    'exhale': 'শ্বাস ছাড়ুন',
    'pause': 'বিরতি দিন',
    'start_protocol': 'চক্র শুরু করুন',
    'pause_protocol': 'চক্র থামান',
    'reset_protocol': 'রিসেট করুন',
    
    'corps_level': 'কোর কমান্ড',
    'division_level': 'ডিভিশন কমান্ড',
    'brigade_level': 'ব্রিগেড কমান্ড',
    'battalion_level': 'ব্যাটালিয়ন স্তর',
    'company_level': 'কোম্পানি পোস্ট',
    'section_drilldown': 'সামরিক কমাণ্ড কাঠামো',
  },

  ta: {
    // Tamil
    'defense_command': 'பாதுகாப்புக் கட்டளை',
    'app_title': 'வீரர் மன அழுத்த மற்றும் நலன் புலனாய்வு கட்டளை அமைப்பு',
    'jai_hind': 'ஜெய் ஹிந்த்',
    'welcome_soldier': 'உங்கள் தனிப்பட்ட தினசரி நல்வாழ்வு கட்டுப்பாட்டு மையம். உங்கள் உடல்நிலை மீட்டெடுப்பைக் கண்காணித்து, ஏஐ சுகாதாரப் பரிந்துரைகளைப் பெறுங்கள்.',
    'personal_dashboard': 'தனிப்பட்ட டாஷ்போர்டு',
    'daily_checkin': 'தினசரி பதிவு',
    'ai_health_insights': 'ஏஐ சுகாதார நுண்ணறிவு',
    'recovery_activities': 'மீட்பு நடவடிக்கைகள்',
    'my_alerts_sos': 'எனது அவசர எச்சரிக்கைகள் (SOS)',
    'my_service_record': 'எனது சேவைப் பதிவு',
    'unit_hierarchy': 'படைப் பிரிவு படிநிலை மரம்',
    'sos_distress_alert': 'அவசர ஆபத்து எச்சரிக்கை (SOS)',
    'sos_active': 'அவசர எச்சரிக்கை செயலில் உள்ளது',
    'record_daily_checkin': 'தினசரி பதிவைச் சேர்க்கவும்',
    'form_16_dossier': 'படிவம் 16 நலன் ஆவணம் 🖨️',
    
    'article_42a_title': 'பிரிவு 42-ஏ பாதுகாப்பு மருத்துவச் சிறப்புரிமை & சட்டரீதியான ரகசியத்தன்மை செயலில் உள்ளது',
    'non_punitive_badge': 'தண்டனையற்ற பாதுகாப்பு புகலிடம்',
    'article_42a_desc': 'உங்கள் தனிப்பட்ட மனநிலை மற்றும் மருத்துவப் பதிவுகள் சட்டப்பூர்வமாகப் பாதுகாக்கப்பட்டவை. இராணுவ மருத்துவர்களுக்கு மட்டுமே அணுகல் உண்டு.',
    'view_transparency_matrix': 'வெளிப்படைத்தன்மை மேட்ரிக்ஸைப் பார்க்கவும்',
    'hide_privacy_barrier': 'மேட்ரிக்ஸை மறைக்கவும்',
    'what_doctors_see': 'மருத்துவ அதிகாரிகள் பார்ப்பது:',
    'what_commanders_see': 'படைத் தளபதி பார்ப்பது (மொத்தத் தயார்நிலை மட்டுமே):',
    
    'checkin_heading': 'தினசரி ரகசிய நல்வாழ்வு பதிவு',
    'checkin_sub': 'கடந்த 24 மணி நேர உடல் நிலையைப் பதிவு செய்யவும்.',
    'sleep_hours': 'தூங்கிய மணிநேரம் (கடந்த 24 மணி)',
    'mental_mood': 'மனநிலை / உணர்வு நிலை',
    'fatigue_level': 'சோர்வு நிலை',
    'workload_strain': 'பணிப்பளு அழுத்தம்',
    'musculoskeletal_strain': 'உடல் தசை வலி',
    'duty_days_without_leave': 'விடுமுறை இல்லாத தொடர் பணி நாட்கள்',
    'confidential_notes': 'ரகசியக் குறிப்புகள் (விருப்பத்தேர்வு)',
    'submit_checkin': 'பதிவைச் சமர்ப்பிக்கவும்',
    'syncing': 'ஒத்திசைக்கப்படுகிறது...',
    'checkin_success': 'தினசரி பதிவு வெற்றிகரமாகச் சமர்ப்பிக்கப்பட்டது!',
    
    'wellness_score_heading': 'தனிப்பட்ட நல்வாழ்வு மதிப்பீடு மற்றும் முக்கிய அறிகுறிகள்',
    'combat_fit': 'போருக்குத் தயார்',
    'optimal_status': 'உகந்த செயல்பாட்டு நிலை',
    'sleep_restoration': 'தூக்க மீட்பு',
    'fatigue_burnout': 'சோர்வுக் குறியீடு',
    'physical_strain': 'உடல் சிரமம்',
    'consecutive_duty_days': 'தொடர் பணி நாட்கள்',
    
    'tactical_resilience': 'தந்திரோபாய பாக்ஸ் சுவாசப் பயிற்சி',
    'box_breathing_desc': 'மன அழுத்தத்தைக் குறைக்க 4-4-4-4 வினாடி இராணுவ மூச்சுப் பயிற்சி.',
    'inhale': 'மூச்சை உள்ளே இழுக்கவும்',
    'hold': 'மூச்சை அடக்கவும்',
    'exhale': 'மூச்சை வெளியே விடவும்',
    'pause': 'சிறிது இடைவெளி விடவும்',
    'start_protocol': 'சுழற்சியைத் தொடங்கவும்',
    'pause_protocol': 'நிறுத்தவும்',
    'reset_protocol': 'மீட்டமைக்கவும்',
    
    'corps_level': 'கோர் கட்டளைப் பிரிவு',
    'division_level': 'டிவிஷன் கட்டளைப் பிரிவு',
    'brigade_level': 'பிரிகேட் கட்டளைப் பிரிவு',
    'battalion_level': 'பட்டாலியன் நிலை',
    'company_level': 'கம்பெனி புறக்காவல் நிலை',
    'section_drilldown': 'படைப் படிநிலை கட்டமைப்பு',
  },
};

interface LanguageStore {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

export const useLanguageStore = create<LanguageStore>((set, get) => {
  const savedLang = (localStorage.getItem('pswms_language') as LanguageCode) || 'en';

  return {
    currentLanguage: savedLang in TRANSLATIONS ? savedLang : 'en',
    setLanguage: (lang: LanguageCode) => {
      localStorage.setItem('pswms_language', lang);
      set({ currentLanguage: lang });
    },
    t: (key: string, fallback?: string): string => {
      const current = get().currentLanguage;
      const dict = TRANSLATIONS[current];
      if (dict && dict[key]) {
        return dict[key];
      }
      // Fallback to English
      const enDict = TRANSLATIONS['en'];
      if (enDict && enDict[key]) {
        return enDict[key];
      }
      return fallback || key;
    },
  };
});
