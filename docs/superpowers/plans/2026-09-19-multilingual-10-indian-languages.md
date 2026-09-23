# Multilingual 10 Indian Languages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full multilingual capabilities supporting 11 languages (English + Hindi, Punjabi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia) across Flutter mobile and React web applications, with complete offline localized psychological Self-Assessment questionnaires and Likert response scales.

**Architecture:** In-memory structured translation catalogs for zero-latency, offline-first reliability on mobile and web; dynamic language request propagation to FastAPI backend Gemini engine for online sessions; reactive state providers for instant runtime switching.

**Tech Stack:** Flutter / Dart (Provider, SharedPreferences), React 18 / TypeScript (Zustand, Tailwind CSS), Python 3.11 / FastAPI (Pydantic, Gemini API).

**Spec:** [Multilingual Design Spec](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/docs/superpowers/specs/2026-09-19-multilingual-10-indian-languages-design.md)

---

## Global Constraints
- Target 11 languages: `en`, `hi`, `pa`, `bn`, `ta`, `te`, `mr`, `gu`, `kn`, `ml`, `or`.
- Preserves 100% offline self-assessment capabilities with fallback translation dictionary.
- Fully compatible with existing REST endpoints and authentication tokens.
- No new heavy third-party runtime package dependencies required.

---

### Task 1: Mobile Assessment Translation Bank & Models
**Files:**
- Create: `mobile/lib/core/localization/assessment_translations.dart`
- Modify: `mobile/lib/core/services/localization_service.dart`

- [ ] **Step 1:** Create `assessment_translations.dart` defining standard 5-point Likert options, psychological domains, and 15 daily + weekly question items across all 11 languages.
- [ ] **Step 2:** Expand `LocalizationService` with `supportedLanguages` (11 entries), `getStandardizedOptions()`, `translateQuestion(id, fallbackText)`, and `translateDomain(domainId)`.
- [ ] **Step 3:** Run `flutter analyze` to verify syntax.

---

### Task 2: Mobile UI Dictionaries & Language Selector
**Files:**
- Modify: `mobile/lib/core/services/localization_service.dart`
- Modify: `mobile/lib/core/widgets/language_selector_sheet.dart`
- Modify: `mobile/lib/screens/soldier/soldier_dashboard_screen.dart`

- [ ] **Step 1:** Populate core UI translation keys (Dashboard, Vitals, Breathing, SOS, Dossier) for all 10 Indian languages in `LocalizationService`.
- [ ] **Step 2:** Update `LanguageSelectorSheet` to render an elegant modal sheet listing all 11 languages with regional script labels and active indicator.
- [ ] **Step 3:** Fix RenderFlex overflow on line 3352 of `soldier_dashboard_screen.dart`.
- [ ] **Step 4:** Run `flutter analyze` to confirm no errors.

---

### Task 3: Mobile Self-Assessment Screen Localization
**Files:**
- Modify: `mobile/lib/screens/soldier/self_assessment_screen.dart`

- [ ] **Step 1:** Integrate `Consumer<LocalizationService>` into `SelfAssessmentScreen`.
- [ ] **Step 2:** Replace hardcoded `standardizedOptions` with dynamic `loc.getStandardizedOptions()`.
- [ ] **Step 3:** Localize questions, question count headers, domain badges, and completion modal text.
- [ ] **Step 4:** Pass active language code in `ApiService.post(ApiConstants.generateAssessmentQuestions, {...})`.
- [ ] **Step 5:** Run `flutter analyze` to confirm clean compilation.

---

### Task 4: Web Application Multilingual Expansion
**Files:**
- Modify: `frontend/src/localization/index.ts`
- Modify: `frontend/src/components/common/LanguageSelector.tsx`
- Modify: `frontend/src/pages/wellness/index.tsx`

- [ ] **Step 1:** Expand `LanguageCode` and `SUPPORTED_LANGUAGES` in `frontend/src/localization/index.ts` to include all 10 Indian languages.
- [ ] **Step 2:** Add translations for UI strings, assessment questionnaires, and Likert options.
- [ ] **Step 3:** Update `LanguageSelector.tsx` dropdown to display all 11 languages cleanly.
- [ ] **Step 4:** Run `npm run build` in `frontend/` to verify zero TypeScript errors.

---

### Task 5: Backend Language Propagation
**Files:**
- Modify: `backend/app/api/wellness/routes.py`
- Modify: `backend/app/services/gemini_assessment_engine.py`

- [ ] **Step 1:** Add `language: Optional[str] = "en"` to `AssessmentQuestionGenRequest`.
- [ ] **Step 2:** Update `gemini_engine.generate_dynamic_questions` to accept `language` and append language formatting instructions to the prompt.
- [ ] **Step 3:** Run backend verification test.

---

### Task 6: End-to-End Verification
- [ ] **Step 1:** Run `flutter analyze` in `mobile/`.
- [ ] **Step 2:** Run `npm run build` in `frontend/`.
- [ ] **Step 3:** Run automated test scripts.
