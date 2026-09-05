import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiConstants {
  // Configurable base URL depending on execution environment
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://127.0.0.1:8000/api/v1';
    } else if (Platform.isAndroid) {
      // Android Emulator standard loopback host
      return 'http://10.0.2.2:8000/api/v1';
    } else {
      // iOS Simulator & macOS
      return 'http://127.0.0.1:8000/api/v1';
    }
  }

  // Endpoints
  static String get login => '$baseUrl/authentication/login';
  static String get me => '$baseUrl/authentication/me';
  static String get logout => '$baseUrl/authentication/logout';
  
  static String get assessments => '$baseUrl/wellness/assessments';
  static String get batchSync => '$baseUrl/wellness/batch-sync';
  
  static String get alerts => '$baseUrl/alerts';
  static String get interventions => '$baseUrl/interventions';
  static String get personnel => '$baseUrl/personnel';
  static String get analyticsOverview => '$baseUrl/analytics/overview';
  static String get unitSummary => '$baseUrl/reports/unit-summary';
  static String dossier(String uid) => '$baseUrl/reports/dossier/$uid';
  static String get screenTime => '$baseUrl/wellness/screen-time';
  static String get generateAssessmentQuestions => '$baseUrl/wellness/self-assessment/generate-questions';
  static String get submitSelfAssessment => '$baseUrl/wellness/self-assessment/submit';
  static String get selfAssessmentSummary => '$baseUrl/wellness/self-assessment';
}

