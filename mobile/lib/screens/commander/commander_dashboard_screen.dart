import 'dart:convert';
import 'package:flutter/material.dart';
import '../../core/constants/api_constants.dart';
import '../../core/services/api_service.dart';
import '../../core/theme/app_theme.dart';
import '../../models/alert_model.dart';

class SoldierReadinessItem {
  final String uid;
  final String name;
  final String rank;
  final String regimentalNumber;
  final String unit;
  final String station;
  final int readinessScore;
  final int stressScore;
  final double sleepHours;
  final int consecutiveDutyDays;
  final int fatigueLevel;
  final double trend21d;
  final String status;
  final String tier;

  const SoldierReadinessItem({
    required this.uid,
    required this.name,
    required this.rank,
    required this.regimentalNumber,
    required this.unit,
    required this.station,
    required this.readinessScore,
    required this.stressScore,
    required this.sleepHours,
    required this.consecutiveDutyDays,
    required this.fatigueLevel,
    required this.trend21d,
    required this.status,
    required this.tier,
  });
}

class CommanderDashboardScreen extends StatefulWidget {
  const CommanderDashboardScreen({super.key});

  @override
  State<CommanderDashboardScreen> createState() => _CommanderDashboardScreenState();
}

class _CommanderDashboardScreenState extends State<CommanderDashboardScreen> {
  List<AlertModel> _alerts = [];
  bool _isLoading = true;
  String _searchQuery = '';
  String _selectedTierFilter = 'ALL'; // ALL, TIER_1, TIER_2, TIER_4

  // Comprehensive deployed soldier roster telemetry
  final List<SoldierReadinessItem> _soldiers = const [
    SoldierReadinessItem(
      uid: 'UID-SOL-101',
      name: 'Subedar Major Vijay Rawat',
      rank: 'Subedar Major',
      regimentalNumber: 'ARMY-2012-8012',
      unit: 'Alpha Battalion',
      station: 'Command HQ Forward',
      readinessScore: 94,
      stressScore: 18,
      sleepHours: 7.6,
      consecutiveDutyDays: 2,
      fatigueLevel: 2,
      trend21d: 2.4,
      status: 'Combat Ready',
      tier: 'TIER_1',
    ),
    SoldierReadinessItem(
      uid: 'UID-SOL-104',
      name: 'Naik Gurpreet Singh',
      rank: 'Naik',
      regimentalNumber: 'ARMY-2019-8015',
      unit: 'Alpha Battalion',
      station: 'North Ridge Watchpost',
      readinessScore: 89,
      stressScore: 24,
      sleepHours: 7.4,
      consecutiveDutyDays: 3,
      fatigueLevel: 3,
      trend21d: 1.8,
      status: 'Combat Ready',
      tier: 'TIER_1',
    ),
    SoldierReadinessItem(
      uid: 'UID-SOL-102',
      name: 'Havildar Manoj Tiwari',
      rank: 'Havildar',
      regimentalNumber: 'CRPF-2016-8013',
      unit: 'Bravo Battalion',
      station: 'Sector Checkpoint Alpha',
      readinessScore: 86,
      stressScore: 28,
      sleepHours: 7.2,
      consecutiveDutyDays: 4,
      fatigueLevel: 3,
      trend21d: 1.2,
      status: 'Combat Ready',
      tier: 'TIER_1',
    ),
    SoldierReadinessItem(
      uid: 'UID-SOL-109',
      name: 'Subedar Rajesh Pillai',
      rank: 'Subedar',
      regimentalNumber: 'ARMY-2015-8020',
      unit: 'Signals Regt 9',
      station: 'Secure Comms Bunker 1',
      readinessScore: 84,
      stressScore: 30,
      sleepHours: 7.3,
      consecutiveDutyDays: 3,
      fatigueLevel: 4,
      trend21d: 1.5,
      status: 'Combat Ready',
      tier: 'TIER_1',
    ),
    SoldierReadinessItem(
      uid: 'UID-SOL-111',
      name: 'Havildar Arjun Nair',
      rank: 'Havildar',
      regimentalNumber: 'CRPF-2018-8022',
      unit: 'Disaster Response 1st',
      station: 'Base Camp Sector 4',
      readinessScore: 82,
      stressScore: 32,
      sleepHours: 7.1,
      consecutiveDutyDays: 4,
      fatigueLevel: 4,
      trend21d: 1.1,
      status: 'Combat Ready',
      tier: 'TIER_1',
    ),
    SoldierReadinessItem(
      uid: 'UID-SOL-107',
      name: 'Sepoy Kuldeep Singh',
      rank: 'Sepoy',
      regimentalNumber: 'CRPF-2021-8018',
      unit: 'Alpha Battalion',
      station: 'Battalion Watch Gate 2',
      readinessScore: 74,
      stressScore: 38,
      sleepHours: 7.0,
      consecutiveDutyDays: 3,
      fatigueLevel: 5,
      trend21d: 0.8,
      status: 'Mission Capable',
      tier: 'TIER_2',
    ),
    SoldierReadinessItem(
      uid: 'UID-SOL-105',
      name: 'Naik Rajesh Kumar',
      rank: 'Naik',
      regimentalNumber: 'CRPF-2020-8016',
      unit: 'Alpha Battalion',
      station: 'Forward LOC Mobile Patrol',
      readinessScore: 71,
      stressScore: 42,
      sleepHours: 6.8,
      consecutiveDutyDays: 4,
      fatigueLevel: 5,
      trend21d: 0.4,
      status: 'Mission Capable',
      tier: 'TIER_2',
    ),
    SoldierReadinessItem(
      uid: 'UID-SOL-106',
      name: 'Sepoy Amit Verma',
      rank: 'Sepoy',
      regimentalNumber: 'ARMY-2022-8017',
      unit: 'Field Artillery 3rd Bn',
      station: 'Munitions Supply Depot',
      readinessScore: 67,
      stressScore: 44,
      sleepHours: 6.9,
      consecutiveDutyDays: 5,
      fatigueLevel: 6,
      trend21d: -0.2,
      status: 'Mission Capable',
      tier: 'TIER_2',
    ),
    SoldierReadinessItem(
      uid: 'UID-EMP-015',
      name: 'Sepoy Amit Kumar',
      rank: 'Sepoy',
      regimentalNumber: 'CRPF-2020-8015',
      unit: 'High Altitude Guard',
      station: 'Rear Echelon Rest Camp',
      readinessScore: 56,
      stressScore: 55,
      sleepHours: 6.2,
      consecutiveDutyDays: 5,
      fatigueLevel: 7,
      trend21d: 0.1,
      status: 'Operational Standby',
      tier: 'TIER_3',
    ),
    SoldierReadinessItem(
      uid: 'UID-EMP-012',
      name: 'Havildar Ramesh Chand',
      rank: 'Havildar',
      regimentalNumber: 'ARMY-2017-8012',
      unit: 'Delta Battalion',
      station: 'Sentry Post Charlie',
      readinessScore: 42,
      stressScore: 82,
      sleepHours: 3.8,
      consecutiveDutyDays: 14,
      fatigueLevel: 9,
      trend21d: -1.8,
      status: 'Stand-Down Indicated',
      tier: 'TIER_4',
    ),
    SoldierReadinessItem(
      uid: 'UID-EMP-014',
      name: 'Naik Rohit Sharma',
      rank: 'Naik',
      regimentalNumber: 'CRPF-2018-8014',
      unit: 'Alpha Battalion',
      station: 'LOC Bunker 4',
      readinessScore: 45,
      stressScore: 78,
      sleepHours: 4.2,
      consecutiveDutyDays: 12,
      fatigueLevel: 8,
      trend21d: -1.4,
      status: 'Stand-Down Indicated',
      tier: 'TIER_4',
    ),
    SoldierReadinessItem(
      uid: 'UID-SOL-103',
      name: 'Lance Naik Vikram Rathore',
      rank: 'Lance Naik',
      regimentalNumber: 'ARMY-2021-8014',
      unit: 'Bravo Battalion',
      station: 'High Altitude Post 12',
      readinessScore: 48,
      stressScore: 74,
      sleepHours: 4.5,
      consecutiveDutyDays: 11,
      fatigueLevel: 8,
      trend21d: -1.1,
      status: 'Stand-Down Indicated',
      tier: 'TIER_4',
    ),
    SoldierReadinessItem(
      uid: 'UID-SOL-110',
      name: 'Sepoy Pradeep Yadav',
      rank: 'Sepoy',
      regimentalNumber: 'ARMY-2023-8021',
      unit: 'Field Artillery 3rd Bn',
      station: 'Heavy Battery Emplacement 3',
      readinessScore: 47,
      stressScore: 76,
      sleepHours: 4.1,
      consecutiveDutyDays: 13,
      fatigueLevel: 9,
      trend21d: -1.3,
      status: 'Stand-Down Indicated',
      tier: 'TIER_4',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _fetchAlerts();
  }

  Future<void> _fetchAlerts() async {
    setState(() => _isLoading = true);
    try {
      final response = await ApiService.get(ApiConstants.alerts);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        _alerts = data.map((e) => AlertModel.fromJson(e)).toList();
      }
    } catch (e) {
      debugPrint('Error loading alerts: $e');
    }
    setState(() => _isLoading = false);
  }

  List<SoldierReadinessItem> get _filteredSoldiers {
    return _soldiers.where((s) {
      if (_selectedTierFilter != 'ALL' && s.tier != _selectedTierFilter) {
        return false;
      }
      if (_searchQuery.trim().isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final match = s.name.toLowerCase().contains(q) ||
            s.uid.toLowerCase().contains(q) ||
            s.rank.toLowerCase().contains(q) ||
            s.unit.toLowerCase().contains(q) ||
            s.station.toLowerCase().contains(q);
        if (!match) return false;
      }
      return true;
    }).toList();
  }

  Color _getScoreColor(int score) {
    if (score >= 80) return const Color(0xFF16A34A);
    if (score >= 65) return const Color(0xFF0284C7);
    if (score >= 50) return const Color(0xFFD97706);
    return const Color(0xFFDC2626);
  }

  Color _getScoreBgColor(int score) {
    if (score >= 80) return const Color(0xFFDCFCE7);
    if (score >= 65) return const Color(0xFFE0F2FE);
    if (score >= 50) return const Color(0xFFFEF3C7);
    return const Color(0xFFFEE2E2);
  }

  void _showSoldierDetails(SoldierReadinessItem s) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        final scoreColor = _getScoreColor(s.readinessScore);
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(s.name, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
                      Text('${s.rank} • ${s.regimentalNumber}', style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getScoreBgColor(s.readinessScore),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: scoreColor.withValues(alpha: 0.3)),
                    ),
                    child: Text(
                      '${s.readinessScore}% READY',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: scoreColor),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Assigned Unit', style: TextStyle(fontSize: 12, color: Colors.grey)),
                        Text(s.unit, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
                      ],
                    ),
                    const Divider(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Deployment Station', style: TextStyle(fontSize: 12, color: Colors.grey)),
                        Text(s.station, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
                      ],
                    ),
                    const Divider(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Rest & Sleep Hours', style: TextStyle(fontSize: 12, color: Colors.grey)),
                        Text('${s.sleepHours} hrs/night', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
                      ],
                    ),
                    const Divider(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Consecutive Duty Days', style: TextStyle(fontSize: 12, color: Colors.grey)),
                        Text('${s.consecutiveDutyDays} days', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: s.consecutiveDutyDays > 10 ? Colors.red : Colors.black)),
                      ],
                    ),
                    const Divider(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Fatigue Score Index', style: TextStyle(fontSize: 12, color: Colors.grey)),
                        Text('${s.fatigueLevel}/10', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              if (s.readinessScore < 50)
                ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Fast-Track Stand-Down authorized for ${s.name}. 48h recovery initiated.'),
                        backgroundColor: const Color(0xFF16A34A),
                      ),
                    );
                  },
                  icon: const Icon(Icons.sync_alt, color: Colors.white),
                  label: const Text('AUTHORIZE STAND-DOWN ROTATION', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.white)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFDC2626),
                    minimumSize: const Size(double.infinity, 44),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final filteredJawans = _filteredSoldiers;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Formation Command Center', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchAlerts,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchAlerts,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Tactical Readiness Card
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: AppColors.secondary,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.shield, color: AppColors.accent, size: 24),
                            SizedBox(width: 8),
                            Text(
                              'Formation Readiness Index: 88.4%',
                              style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w900),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          '16 Corps Command Division • 1,240 Personnel Monitored',
                          style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // ==========================================
                  // INDIVIDUAL SOLDIER READINESS ROSTER
                  // ==========================================
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'INDIVIDUAL SOLDIER READINESS ROSTER',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.textSecondary, letterSpacing: 0.5),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFFDCFCE7),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: const Color(0xFF86EFAC)),
                        ),
                        child: Text(
                          '${_soldiers.length} JAWANS',
                          style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Color(0xFF166534)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Search Bar for Soldiers
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.cardBorder),
                    ),
                    child: TextField(
                      onChanged: (val) => setState(() => _searchQuery = val),
                      style: const TextStyle(fontSize: 12),
                      decoration: const InputDecoration(
                        hintText: 'Search soldier by name, rank, or UID...',
                        hintStyle: TextStyle(fontSize: 12, color: Colors.grey),
                        prefixIcon: Icon(Icons.search, size: 18, color: Colors.grey),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Quick Filter Pills
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildFilterPill('ALL', 'All Jawans (${_soldiers.length})'),
                        const SizedBox(width: 6),
                        _buildFilterPill('TIER_1', 'Combat Ready ≥80% (5)'),
                        const SizedBox(width: 6),
                        _buildFilterPill('TIER_2', 'Capable 65-79% (4)'),
                        const SizedBox(width: 6),
                        _buildFilterPill('TIER_4', 'Stand-Down Alert <50% (4)'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Soldier Readiness List
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: filteredJawans.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 10),
                    itemBuilder: (context, idx) {
                      final s = filteredJawans[idx];
                      final scoreColor = _getScoreColor(s.readinessScore);
                      final scoreBg = _getScoreBgColor(s.readinessScore);

                      return InkWell(
                        onTap: () => _showSoldierDetails(s),
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: s.readinessScore < 50
                                  ? const Color(0xFFFCA5A5)
                                  : AppColors.cardBorder,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  CircleAvatar(
                                    radius: 18,
                                    backgroundColor: scoreBg,
                                    child: Text(
                                      s.name.split(' ').map((n) => n[0]).take(2).join(),
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w900,
                                        color: scoreColor,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          s.name,
                                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900),
                                        ),
                                        Text(
                                          '${s.rank} • ${s.unit}',
                                          style: const TextStyle(fontSize: 10, color: AppColors.textSecondary, fontWeight: FontWeight.w600),
                                        ),
                                      ],
                                    ),
                                  ),
                                  // Prominent Readiness Score Badge
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: scoreBg,
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(color: scoreColor.withValues(alpha: 0.4)),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.end,
                                      children: [
                                        Text(
                                          '${s.readinessScore}%',
                                          style: TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w900,
                                            color: scoreColor,
                                          ),
                                        ),
                                        Text(
                                          s.readinessScore >= 80
                                              ? 'READY'
                                              : s.readinessScore >= 65
                                                  ? 'CAPABLE'
                                                  : s.readinessScore >= 50
                                                      ? 'STANDBY'
                                                      : 'ALERT',
                                          style: TextStyle(
                                            fontSize: 7.5,
                                            fontWeight: FontWeight.w900,
                                            color: scoreColor,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),

                              // Linear Readiness Progress Bar
                              ClipRRect(
                                borderRadius: BorderRadius.circular(4),
                                child: LinearProgressIndicator(
                                  value: s.readinessScore / 100.0,
                                  backgroundColor: Colors.grey.shade100,
                                  valueColor: AlwaysStoppedAnimation<Color>(scoreColor),
                                  minHeight: 5,
                                ),
                              ),
                              const SizedBox(height: 8),

                              // Vitals row
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '${s.sleepHours}h rest • ${s.consecutiveDutyDays} duty days',
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: s.sleepHours < 4.5 ? Colors.red : Colors.grey.shade600,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  Text(
                                    'Station: ${s.station}',
                                    style: TextStyle(fontSize: 9.5, color: Colors.grey.shade500),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 20),

                  // High-Risk Alerts Section
                  const Text(
                    'HIGH-RISK ESCALATION WATCHLIST',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5),
                  ),
                  const SizedBox(height: 8),

                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _alerts.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 10),
                    itemBuilder: (context, idx) {
                      final a = _alerts[idx];
                      return Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(
                            color: a.severity == 'CRITICAL' ? AppColors.rose.withValues(alpha: 0.5) : AppColors.cardBorder,
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  a.personnelName,
                                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: a.severity == 'CRITICAL' ? AppColors.roseLight : AppColors.amberLight,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    a.severity,
                                    style: TextStyle(
                                      fontSize: 8,
                                      fontWeight: FontWeight.w900,
                                      color: a.severity == 'CRITICAL' ? AppColors.rose : AppColors.amber,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              a.personnelUid,
                              style: const TextStyle(fontSize: 10, color: AppColors.textSecondary, fontWeight: FontWeight.w700),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              a.triggerReason,
                              style: const TextStyle(fontSize: 11, color: AppColors.textPrimary),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'Directive: ${a.recommendation}',
                              style: const TextStyle(fontSize: 10, color: AppColors.textSecondary, fontStyle: FontStyle.italic),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildFilterPill(String tierKey, String label) {
    final isSelected = _selectedTierFilter == tierKey;
    return GestureDetector(
      onTap: () => setState(() => _selectedTierFilter = tierKey),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.secondary : Colors.grey.shade100,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.secondary : Colors.grey.shade300,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: isSelected ? Colors.white : Colors.grey.shade700,
          ),
        ),
      ),
    );
  }
}

