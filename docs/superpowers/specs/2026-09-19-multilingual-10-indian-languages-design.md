# Technical Design Spec: Multilingual 10 Indian Languages Support (Mobile & Web)

## 1. Executive Summary
Expand multilingual capabilities across the entire system—with specific focus on the **Soldier Self-Assessment module**, **Soldier Dashboard**, and **Web Command Console**—to support **11 languages** (English + 10 Indian scheduled languages: Hindi, Punjabi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia).

The implementation follows an **offline-first hybrid architecture**:
- Full in-memory localized question banks and UI dictionaries guarantee 100% offline availability for remote field deployments.
- Dynamic backend AI question generation accepts a language parameter for contextual questions generated via Gemini.
- Full reactivity allows soldiers and officers to switch languages dynamically with zero app restarts.

---

## 2. Language Matrix

| Code | English Name | Native Name | Script |
| :--- | :--- | :--- | :--- |
| `en` | English | English | Latin |
| `hi` | Hindi | हिन्दी | Devanagari |
| `pa` | Punjabi | ਪੰਜਾਬੀ | Gurmukhi |
| `bn` | Bengali | বাংলা | Bengali |
| `ta` | Tamil | தமிழ் | Tamil |
| `te` | Telugu | తెలుగు | Telugu |
| `mr` | Marathi | मराठी | Devanagari |
| `gu` | Gujarati | ગુજરાતી | Gujarati |
| `kn` | Kannada | ಕನ್ನಡ | Kannada |
| `ml` | Malayalam | മലയാളം | Malayalam |
| `or` | Odia | ଓଡ଼ିଆ | Odia |

---

## 3. Architecture & Key Components

### 3.1 Mobile App (Flutter)
1. **`LocalizationService` (`mobile/lib/core/services/localization_service.dart`)**:
   - Register all 11 languages with their codes, English names, native script names, and flags.
   - Add helper methods:
     - `t(key, [fallback])` for general UI text.
     - `translateQuestion(id, fallbackText)` for question bank localization.
     - `getStandardizedOptions()` returning the 5-point Likert scale in the active language (*Never*, *Rarely*, *Sometimes*, *Often*, *Almost Always*).
     - `translateDomain(domainId)` for psychological assessment domain names.
2. **Modular Dictionaries (`mobile/lib/core/localization/`)**:
   - `assessment_translations.dart`: Contains localized versions of all standardized psychological assessment questions (Sleep Health, Emotional Composure, Stress Perception, Physical Fatigue, Cognitive Sharpness, Anxiety & Hypervigilance, Operational Workload, Social Support, Motivation, etc.) and response scales across all 11 languages.
   - `ui_translations.dart`: Contains full translations for Dashboard, SOS, Breathing, Vitals, Privacy Shield, Navigation, and Dossier.
3. **`SelfAssessmentScreen` (`mobile/lib/screens/soldier/self_assessment_screen.dart`)**:
   - Integrate `Consumer<LocalizationService>` / `Provider.of<LocalizationService>(context)`.
   - Pass active `lang` to backend when requesting dynamic questions.
   - Localize fallback questions using the assessment translation bank.
   - Localize Likert scale buttons, category chips, question counter ("Question X of Y"), domain badges, and completion result summary dialogs.
4. **`LanguageSelectorSheet` (`mobile/lib/core/widgets/language_selector_sheet.dart`)**:
   - Render a responsive grid/list of all 11 languages with active checkmark and native typography.
5. **Layout Overflow Fix**:
   - Fix `RenderFlex overflowed by 8.7 pixels` in `soldier_dashboard_screen.dart` around line 3352 by wrapping flexible text elements or applying `Flexible` / `Expanded` with proper text overflow ellipsis.

### 3.2 Web App (React / Vite / TypeScript)
1. **Language Store (`frontend/src/localization/index.ts`)**:
   - Update `LanguageCode = 'en' | 'hi' | 'pa' | 'bn' | 'ta' | 'te' | 'mr' | 'gu' | 'kn' | 'ml' | 'or'`.
   - Populate `TRANSLATIONS` dictionary for all 11 languages with complete translation parity.
   - Add assessment questions and standardized Likert options to the translation schema.
2. **UI & Language Selector (`frontend/src/components/common/LanguageSelector.tsx`)**:
   - Update dropdown to list all 11 languages with clean regional script rendering.
3. **Self-Assessment / Wellness Views (`frontend/src/pages/wellness/` and components)**:
   - Ensure all assessment strings and options use `useLanguageStore().t(...)`.

### 3.3 Backend (FastAPI)
1. **`AssessmentQuestionGenRequest` (`backend/app/api/wellness/routes.py`)**:
   - Add `language: Optional[str] = "en"`.
2. **`GeminiAssessmentEngine` (`backend/app/services/gemini_assessment_engine.py`)**:
   - Inject the requested language into the dynamic Gemini prompt so questions can be generated directly in the soldier's chosen language.
   - Fallback question bank supports multilingual resolution.

---

## 4. Error Handling & Fallbacks
- If a translation key is missing for any new language, fall back automatically to Hindi or English (`en`) to prevent crashes or blank strings.
- Network disconnection falls back seamlessly to the in-memory pre-translated question bank.
- Non-Latin script font rendering utilizes system Unicode fallback and standard Google Fonts.

---

## 5. Verification Plan
1. **Mobile App**:
   - Run `flutter analyze` or Dart compilation checks to ensure type safety.
   - Test language switching across all 11 languages in the mobile app.
   - Open Self-Assessment Screen and verify that question text, options (Never -> Almost Always), and domain titles reflect the selected language.
   - Verify that the layout overflow on `soldier_dashboard_screen.dart` is eliminated.
2. **Web App**:
   - Run `npm run build` / TypeScript check in `frontend/` to verify zero type errors.
   - Verify language dropdown changes UI state and updates all localized components.
3. **Backend API**:
   - Verify `/api/v1/wellness/self-assessment/generate-questions` with `language` parameter.
