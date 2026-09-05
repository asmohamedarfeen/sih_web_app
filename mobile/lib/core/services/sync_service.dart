import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import '../constants/api_constants.dart';
import 'api_service.dart';
import '../../models/wellness_model.dart';

class SyncService extends ChangeNotifier {
  static const String _offlineQueueKey = 'pswms_offline_wellness_queue';
  static const String _cachedAssessmentsKey = 'pswms_cached_assessments_history';

  List<WellnessAssessmentModel> _offlineQueue = [];
  List<WellnessAssessmentModel> _history = [];
  bool _isOnline = true;
  bool _isSyncing = false;
  String? _lastSyncTime;

  List<WellnessAssessmentModel> get offlineQueue => _offlineQueue;
  List<WellnessAssessmentModel> get history => _history;
  bool get isOnline => _isOnline;
  bool get isSyncing => _isSyncing;
  int get pendingCount => _offlineQueue.length;
  String? get lastSyncTime => _lastSyncTime;

  SyncService() {
    _init();
  }

  Future<void> _init() async {
    await _loadStoredQueue();
    await _loadCachedHistory();
    _initConnectivityListener();
  }

  void _initConnectivityListener() {
    Connectivity().onConnectivityChanged.listen((List<ConnectivityResult> results) {
      final hasConnection = results.any((r) => r != ConnectivityResult.none);
      _isOnline = hasConnection;
      notifyListeners();

      if (hasConnection && _offlineQueue.isNotEmpty) {
        syncPendingQueue();
      }
    });
  }

  Future<void> _loadStoredQueue() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_offlineQueueKey);
    if (raw != null) {
      try {
        final List<dynamic> list = jsonDecode(raw);
        _offlineQueue = list.map((e) => WellnessAssessmentModel.fromJson(e)).toList();
        notifyListeners();
      } catch (e) {
        debugPrint('Error loading offline queue: $e');
      }
    }
  }

  Future<void> _saveQueue() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = jsonEncode(_offlineQueue.map((e) => e.toJson()).toList());
    await prefs.setString(_offlineQueueKey, raw);
  }

  Future<void> _loadCachedHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_cachedAssessmentsKey);
    if (raw != null) {
      try {
        final List<dynamic> list = jsonDecode(raw);
        _history = list.map((e) => WellnessAssessmentModel.fromJson(e)).toList();
        notifyListeners();
      } catch (e) {
        debugPrint('Error loading cached history: $e');
      }
    }
  }

  Future<void> _saveHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = jsonEncode(_history.map((e) => e.toJson()).toList());
    await prefs.setString(_cachedAssessmentsKey, raw);
  }

  /// Adds a check-in to offline queue or submits immediately if online
  Future<Map<String, dynamic>> submitCheckin(WellnessAssessmentModel item) async {
    // Generate a client-side ID
    final clientId = 'client-${DateTime.now().millisecondsSinceEpoch}';
    final stampedItem = WellnessAssessmentModel(
      clientId: clientId,
      personnelUid: item.personnelUid,
      personnelName: item.personnelName,
      sleepHours: item.sleepHours,
      fatigueLevel: item.fatigueLevel,
      moodScore: item.moodScore,
      workloadPressure: item.workloadPressure,
      physicalStrain: item.physicalStrain,
      consecutiveDutyDays: item.consecutiveDutyDays,
      notes: item.notes,
      submittedAt: DateTime.now().toIso8601String(),
      isSynced: false,
    );

    if (!_isOnline) {
      _offlineQueue.add(stampedItem);
      _history.insert(0, stampedItem);
      await _saveQueue();
      await _saveHistory();
      notifyListeners();
      return {
        'status': 'queued',
        'message': 'Saved offline. Telemetry will sync automatically when back online.',
        'offline': true,
      };
    }

    // Attempt direct post
    try {
      final response = await ApiService.post(ApiConstants.assessments, {
        'personnel_uid': item.personnelUid,
        'sleep_hours': item.sleepHours,
        'fatigue_level': item.fatigueLevel,
        'mood_score': item.moodScore,
        'workload_pressure': item.workloadPressure,
        'physical_strain': item.physicalStrain,
        'consecutive_duty_days': item.consecutiveDutyDays,
        'notes': item.notes,
      });

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final syncedItem = WellnessAssessmentModel(
          id: data['assessment_id'],
          clientId: clientId,
          personnelUid: item.personnelUid,
          personnelName: item.personnelName,
          sleepHours: item.sleepHours,
          fatigueLevel: item.fatigueLevel,
          moodScore: item.moodScore,
          workloadPressure: item.workloadPressure,
          physicalStrain: item.physicalStrain,
          consecutiveDutyDays: item.consecutiveDutyDays,
          stressScore: (data['evaluation']?['stress_score'] as num?)?.toDouble(),
          riskLevel: data['evaluation']?['risk_level'],
          notes: item.notes,
          submittedAt: DateTime.now().toIso8601String(),
          isSynced: true,
        );

        _history.insert(0, syncedItem);
        await _saveHistory();
        _lastSyncTime = DateTime.now().toLocal().toString().split('.')[0];
        notifyListeners();

        return {
          'status': 'synced',
          'message': 'Telemetry evaluated and synced with Defense HRMS gateway.',
          'evaluation': data['evaluation'],
          'offline': false,
        };
      } else {
        // Fallback to queue if server error
        _offlineQueue.add(stampedItem);
        _history.insert(0, stampedItem);
        await _saveQueue();
        await _saveHistory();
        notifyListeners();
        return {
          'status': 'queued',
          'message': 'Server currently unreachable. Telemetry queued offline.',
          'offline': true,
        };
      }
    } catch (e) {
      _offlineQueue.add(stampedItem);
      _history.insert(0, stampedItem);
      await _saveQueue();
      await _saveHistory();
      notifyListeners();
      return {
        'status': 'queued',
        'message': 'Saved locally. Syncing will resume upon network restoration.',
        'offline': true,
      };
    }
  }

  /// Flushes the offline queue to the backend `/batch-sync` endpoint
  Future<bool> syncPendingQueue() async {
    if (_offlineQueue.isEmpty || _isSyncing) return true;

    _isSyncing = true;
    notifyListeners();

    try {
      final payload = {
        'items': _offlineQueue.map((e) => {
          'client_id': e.clientId,
          'personnel_uid': e.personnelUid,
          'sleep_hours': e.sleepHours,
          'fatigue_level': e.fatigueLevel,
          'mood_score': e.moodScore,
          'workload_pressure': e.workloadPressure,
          'physical_strain': e.physicalStrain,
          'consecutive_duty_days': e.consecutiveDutyDays,
          'notes': e.notes,
          'logged_at_offline': e.submittedAt,
        }).toList(),
      };

      final response = await ApiService.post(ApiConstants.batchSync, payload);

      if (response.statusCode == 200) {
        _offlineQueue.clear();
        await _saveQueue();

        // Mark local history items as synced
        _history = _history.map((h) => WellnessAssessmentModel(
          id: h.id,
          clientId: h.clientId,
          personnelUid: h.personnelUid,
          personnelName: h.personnelName,
          sleepHours: h.sleepHours,
          fatigueLevel: h.fatigueLevel,
          moodScore: h.moodScore,
          workloadPressure: h.workloadPressure,
          physicalStrain: h.physicalStrain,
          consecutiveDutyDays: h.consecutiveDutyDays,
          stressScore: h.stressScore ?? 60.0,
          riskLevel: h.riskLevel ?? 'NOMINAL',
          notes: h.notes,
          submittedAt: h.submittedAt,
          isSynced: true,
        )).toList();

        await _saveHistory();
        _lastSyncTime = DateTime.now().toLocal().toString().split('.')[0];
        _isSyncing = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      debugPrint('Sync failed: $e');
    }

    _isSyncing = false;
    notifyListeners();
    return false;
  }

  /// Fetches remote assessment history from server
  Future<void> fetchRemoteHistory(String? personnelUid) async {
    try {
      final url = personnelUid != null
          ? '${ApiConstants.assessments}?personnel_uid=$personnelUid'
          : ApiConstants.assessments;
      final response = await ApiService.get(url);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        _history = data.map((e) => WellnessAssessmentModel.fromJson(e)).toList();
        await _saveHistory();
        _lastSyncTime = DateTime.now().toLocal().toString().split('.')[0];
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error fetching history: $e');
    }
  }
}
