class UserModel {
  final String email;
  final String fullName;
  final String role;
  final String? uid;
  final String? forceId;
  final String? regimentalNumber;
  final String? rank;
  final String? unit;
  final String? branch;
  final String? employeeId;
  final String? avatarUrl;

  UserModel({
    required this.email,
    required this.fullName,
    required this.role,
    this.uid,
    this.forceId,
    this.regimentalNumber,
    this.rank,
    this.unit,
    this.branch,
    this.employeeId,
    this.avatarUrl,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      email: json['email'] ?? '',
      fullName: json['full_name'] ?? json['name'] ?? '',
      role: json['role'] ?? 'PERSONNEL',
      uid: json['uid'],
      forceId: json['force_id'],
      regimentalNumber: json['regimental_number'],
      rank: json['rank'],
      unit: json['unit'],
      branch: json['branch'],
      employeeId: json['employee_id'],
      avatarUrl: json['avatar_url'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'full_name': fullName,
      'role': role,
      'uid': uid,
      'force_id': forceId,
      'regimental_number': regimentalNumber,
      'rank': rank,
      'unit': unit,
      'branch': branch,
      'employee_id': employeeId,
      'avatar_url': avatarUrl,
    };
  }

  bool get isSoldier => role == 'SOLDIER' || role == 'PERSONNEL';
  bool get isWelfareOfficer => role == 'WELFARE_OFFICER';
  bool get isCommander => role == 'COMMANDER';
  bool get isAdmin =>
      role == 'SUPER_ADMIN' ||
      role == 'SYS_ADMIN' ||
      role == 'SECURITY_ADMIN' ||
      role == 'ADMIN' ||
      role == 'HR_OFFICER';
}
