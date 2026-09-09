import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiConstants {
  static const String prefHostKey = 'pswms_gateway_host';
  // Mac Local Area Network IP for physical devices (e.g. iPhone)
  static const String defaultLocalHost = '10.56.52.238:8000';
  static String? customHost;

  static Future<void> loadSavedHost() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      customHost = prefs.getString(prefHostKey);
    } catch (_) {}
  }

  static Future<void> setCustomHost(String host) async {
    customHost = host.trim();
    try {
      final prefs = await SharedPreferences.getInstance();
      if (customHost != null && customHost!.isNotEmpty) {
        await prefs.setString(prefHostKey, customHost!);
      } else {
        await prefs.remove(prefHostKey);
      }
    } catch (_) {}
  }

  static Future<bool> testConnection([String? host]) async {
    final targetHost = host != null && host.trim().isNotEmpty ? host.trim() : activeHost;
    final url = targetHost.startsWith('http') ? targetHost : 'http://$targetHost';
    final cleanBase = url.endsWith('/api/v1') ? url.substring(0, url.length - 7) : url;
    final healthUrl = '$cleanBase/health';
    try {
      final response = await http.get(Uri.parse(healthUrl)).timeout(const Duration(seconds: 4));
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  static String get activeHost {
    if (customHost != null && customHost!.isNotEmpty) {
      return customHost!;
    }
    if (kIsWeb) {
      return '127.0.0.1:8000';
    } else if (Platform.isAndroid) {
      return '10.0.2.2:8000';
    } else if (Platform.isIOS) {
      return defaultLocalHost;
    } else {
      return '127.0.0.1:8000';
    }
  }

  // Configurable base URL depending on execution environment
  static String get baseUrl {
    final host = activeHost;
    if (host.startsWith('http://') || host.startsWith('https://')) {
      return host.endsWith('/api/v1') ? host : '$host/api/v1';
    }
    return 'http://$host/api/v1';
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

