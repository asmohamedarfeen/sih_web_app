class InterventionModel {
  final int id;
  final String caseNumber;
  final String personnelUid;
  final String personnelName;
  final String rank;
  final String category;
  final String urgency;
  final String status;
  final String title;
  final String description;
  final String actionPlan;
  final double requestedAmount;
  final double approvedAmount;
  final String counselorAssigned;
  final String counselingDate;
  final String venue;

  InterventionModel({
    required this.id,
    required this.caseNumber,
    required this.personnelUid,
    required this.personnelName,
    required this.rank,
    required this.category,
    required this.urgency,
    required this.status,
    required this.title,
    required this.description,
    required this.actionPlan,
    required this.requestedAmount,
    required this.approvedAmount,
    required this.counselorAssigned,
    required this.counselingDate,
    required this.venue,
  });

  factory InterventionModel.fromJson(Map<String, dynamic> json) {
    return InterventionModel(
      id: json['id'] ?? 0,
      caseNumber: json['case_number'] ?? '',
      personnelUid: json['personnel_uid'] ?? '',
      personnelName: json['personnel_name'] ?? '',
      rank: json['rank'] ?? '',
      category: json['category'] ?? '',
      urgency: json['urgency'] ?? 'MODERATE',
      status: json['status'] ?? 'OPEN',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      actionPlan: json['action_plan'] ?? '',
      requestedAmount: (json['requested_amount'] as num?)?.toDouble() ?? 0.0,
      approvedAmount: (json['approved_amount'] as num?)?.toDouble() ?? 0.0,
      counselorAssigned: json['counselor_assigned'] ?? '',
      counselingDate: json['counseling_date'] ?? '',
      venue: json['venue'] ?? '',
    );
  }
}
