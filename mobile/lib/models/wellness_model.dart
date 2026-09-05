class WellnessAssessmentModel {
  final int? id;
  final String? clientId;
  final String personnelUid;
  final String? personnelName;
  final double sleepHours;
  final int fatigueLevel;
  final int moodScore;
  final int workloadPressure;
  final int physicalStrain;
  final int consecutiveDutyDays;
  final double? stressScore;
  final String? riskLevel;
  final String? notes;
  final String? submittedAt;
  final bool isSynced;

  WellnessAssessmentModel({
    this.id,
    this.clientId,
    required this.personnelUid,
    this.personnelName,
    required this.sleepHours,
    required this.fatigueLevel,
    required this.moodScore,
    required this.workloadPressure,
    required this.physicalStrain,
    required this.consecutiveDutyDays,
    this.stressScore,
    this.riskLevel,
    this.notes,
    this.submittedAt,
    this.isSynced = true,
  });

  factory WellnessAssessmentModel.fromJson(Map<String, dynamic> json) {
    return WellnessAssessmentModel(
      id: json['id'],
      clientId: json['client_id'],
      personnelUid: json['personnel_uid'] ?? '',
      personnelName: json['personnel_name'],
      sleepHours: (json['sleep_hours'] as num?)?.toDouble() ?? 7.0,
      fatigueLevel: json['fatigue_level'] ?? 5,
      moodScore: json['mood_score'] ?? 5,
      workloadPressure: json['workload_pressure'] ?? 5,
      physicalStrain: json['physical_strain'] ?? 5,
      consecutiveDutyDays: json['consecutive_duty_days'] ?? 1,
      stressScore: (json['stress_score'] as num?)?.toDouble(),
      riskLevel: json['risk_level'],
      notes: json['notes'],
      submittedAt: json['submitted_at'],
      isSynced: json['is_synced'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'client_id': clientId,
      'personnel_uid': personnelUid,
      'personnel_name': personnelName,
      'sleep_hours': sleepHours,
      'fatigue_level': fatigueLevel,
      'mood_score': moodScore,
      'workload_pressure': workloadPressure,
      'physical_strain': physicalStrain,
      'consecutive_duty_days': consecutiveDutyDays,
      'stress_score': stressScore,
      'risk_level': riskLevel,
      'notes': notes,
      'submitted_at': submittedAt,
      'is_synced': isSynced,
    };
  }
}
