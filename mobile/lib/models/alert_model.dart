class AlertModel {
  final int id;
  final String personnelUid;
  final String personnelName;
  final String alertType;
  final String severity;
  final String triggerReason;
  final String recommendation;
  final bool isAcknowledged;
  final String createdAt;

  AlertModel({
    required this.id,
    required this.personnelUid,
    required this.personnelName,
    required this.alertType,
    required this.severity,
    required this.triggerReason,
    required this.recommendation,
    required this.isAcknowledged,
    required this.createdAt,
  });

  factory AlertModel.fromJson(Map<String, dynamic> json) {
    return AlertModel(
      id: json['id'] ?? 0,
      personnelUid: json['personnel_uid'] ?? '',
      personnelName: json['personnel_name'] ?? '',
      alertType: json['alert_type'] ?? 'PHYSIOLOGICAL',
      severity: json['severity'] ?? 'MODERATE',
      triggerReason: json['trigger_reason'] ?? '',
      recommendation: json['recommendation'] ?? '',
      isAcknowledged: json['is_acknowledged'] ?? false,
      createdAt: json['created_at'] ?? '',
    );
  }
}
