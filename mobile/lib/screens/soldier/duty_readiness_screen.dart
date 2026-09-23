import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/services/auth_service.dart';
import '../../core/services/localization_service.dart';
import '../../core/theme/app_theme.dart';

class DutyReadinessScreen extends StatefulWidget {
  const DutyReadinessScreen({super.key});

  @override
  State<DutyReadinessScreen> createState() => _DutyReadinessScreenState();
}

class _DutyReadinessScreenState extends State<DutyReadinessScreen> {
  // Duty Schedule data
  final int _consecutiveDutyDays = 4;
  final int _maxAllowedDutyDays = 7;
  final int _hoursToRestRotation = 36;
  final int _casualLeaveRemaining = 8;
  final int _annualLeaveAccrued = 22;

  final List<Map<String, dynamic>> _upcomingDuties = [
    {
      'date': 'Today (18:00 - 02:00)',
      'duty': 'Perimeter Overwatch Watch',
      'post': 'Forward Post Alpha-3',
      'tempo': 'HIGH-TEMPO',
      'tempoColor': AppColors.amber,
      'status': 'Scheduled',
    },
    {
      'date': 'Tomorrow (06:00 - 14:00)',
      'duty': 'Area Reconnaissance Patrol',
      'post': 'Sector Echo Patrol Route',
      'tempo': 'STANDARD',
      'tempoColor': AppColors.primary,
      'status': 'Confirmed',
    },
    {
      'date': 'Day 3 (14:00 - 22:00)',
      'duty': 'Communications Watch & Log',
      'post': 'Battalion C3I Center',
      'tempo': 'REST-ROTATION',
      'tempoColor': AppColors.accent,
      'status': 'Stand-Down Prep',
    },
    {
      'date': 'Day 4 - Day 5',
      'duty': 'Mandatory 48h Recovery Reset',
      'post': 'Base Rest & Recovery Wing',
      'tempo': 'MANDATORY REST',
      'tempoColor': Colors.green,
      'status': 'Approved by Roster',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);
    final loc = Provider.of<LocalizationService>(context);
    final user = auth.currentUser;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Banner: Operational Readiness & Duty Transparency
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppColors.secondary, Color(0xFF0F2338)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.secondary.withValues(alpha: 0.25),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Wrap(
                      alignment: WrapAlignment.spaceBetween,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      spacing: 8,
                      runSpacing: 6,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.security, color: AppColors.accent, size: 14),
                              const SizedBox(width: 4),
                              Text(
                                loc.t('OPERATIONAL READINESS & DUTY HUB', 'OPERATIONAL READINESS & DUTY HUB'),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 0.8,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.emerald.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.green.withValues(alpha: 0.4)),
                          ),
                          child: Text(
                            loc.t('voluntary_privacy', 'VOLUNTARY & CONFIDENTIAL'),
                            style: const TextStyle(
                              color: Color(0xFF4ADE80),
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Text(
                      user?.fullName ?? 'Rifleman Arjun',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      '${user?.rank ?? "Rifleman"} • ${user?.regimentalNumber ?? "ARMY-2018-4015"} • ${user?.unit ?? "10 Para SF"}',
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.white.withValues(alpha: 0.8),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 14),
                    // Quick stats ribbon
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildStatItem('Combat Readiness', '92%', Colors.greenAccent),
                          _buildDivider(),
                          _buildStatItem('Shift Days', '$_consecutiveDutyDays / $_maxAllowedDutyDays', AppColors.amber),
                          _buildDivider(),
                          _buildStatItem('Next 48h Rest', 'in ${_hoursToRestRotation}h', Colors.cyanAccent),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Duty Schedule Transparency Section
              Row(
                children: [
                  const Icon(Icons.schedule, color: AppColors.secondary, size: 18),
                  const SizedBox(width: 8),
                  Text(
                    loc.t('upcoming_duties', 'Duty Schedule & Shift Transparency'),
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppColors.secondary),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              const Text(
                'Full transparency into watch rotations, post assignments, and mandatory recovery cycles.',
                style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 12),

              // Upcoming Shift Cards
              ..._upcomingDuties.map((duty) => _buildDutyCard(duty)),

              const SizedBox(height: 16),

              // Rest & Leave Entitlement Balance Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.cardBorder),
                  boxShadow: const [
                    BoxShadow(color: Color(0x0A000000), blurRadius: 8, offset: Offset(0, 2)),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.beach_access_outlined, color: AppColors.primary, size: 18),
                        const SizedBox(width: 8),
                        Text(
                          loc.t('leave_accrued', 'Leave Entitlements & Furlough Rights'),
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: AppColors.secondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _buildLeaveBox(
                            'Casual Leave (CL)',
                            '$_casualLeaveRemaining Days',
                            'Available without restriction',
                            Colors.blue,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _buildLeaveBox(
                            'Annual Furlough (AL)',
                            '$_annualLeaveAccrued Days',
                            'Accrued standard cycle',
                            Colors.teal,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.background,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.cardBorder),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.info_outline, color: AppColors.primary, size: 14),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Article 14 Rotational Relief Directive guarantees a mandatory 48-hour decompression break after 7 consecutive high-tempo duties.',
                              style: TextStyle(fontSize: 10, color: AppColors.textSecondary, height: 1.3),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Transparent Privacy Ledger: What Command Sees vs What Medical Sees
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF0D1B2A),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: Colors.green.withValues(alpha: 0.3)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.verified_user_outlined, color: Color(0xFF4ADE80), size: 18),
                        SizedBox(width: 8),
                        Text(
                          'Soldier Privacy Safeguards & Trust Ledger',
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Colors.white),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Strict medical confidentiality firewalls protect your disclosures:',
                      style: TextStyle(fontSize: 11, color: Colors.white70),
                    ),
                    const SizedBox(height: 10),
                    _buildLedgerRow(
                      'Unit Commander Sees:',
                      'Aggregated Readiness (Ready/Stand-Down), Shift Rosters, Watch Schedule.',
                      Icons.shield_outlined,
                      Colors.amberAccent,
                    ),
                    const SizedBox(height: 8),
                    _buildLedgerRow(
                      'Medical / Welfare Officer Sees:',
                      'Detailed physiological recovery, confidential counseling notes, welfare grants.',
                      Icons.medical_services_outlined,
                      Colors.cyanAccent,
                    ),
                    const SizedBox(height: 8),
                    _buildLedgerRow(
                      'Career Promotion Boards:',
                      'ZERO ACCESS. Mental wellness queries and check-ins are strictly barred from service dossiers.',
                      Icons.block,
                      Colors.greenAccent,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w900,
            color: color,
            fontFamily: 'monospace',
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: TextStyle(
            fontSize: 9,
            fontWeight: FontWeight.w600,
            color: Colors.white.withValues(alpha: 0.7),
          ),
        ),
      ],
    );
  }

  Widget _buildDivider() {
    return Container(
      width: 1,
      height: 24,
      color: Colors.white.withValues(alpha: 0.15),
    );
  }

  Widget _buildDutyCard(Map<String, dynamic> duty) {
    final Color color = duty['tempoColor'] as Color;
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.cardBorder),
        boxShadow: const [
          BoxShadow(color: Color(0x06000000), blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 4,
            height: 36,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      duty['duty'],
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: AppColors.secondary,
                      ),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        duty['tempo'],
                        style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: color),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    Text(
                      duty['date'],
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                    ),
                    const Text(' • ', style: TextStyle(color: AppColors.textMuted)),
                    Text(
                      duty['post'],
                      style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLeaveBox(String title, String days, String subtitle, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: color)),
          const SizedBox(height: 4),
          Text(
            days,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: color, fontFamily: 'monospace'),
          ),
          const SizedBox(height: 2),
          Text(subtitle, style: const TextStyle(fontSize: 8, color: AppColors.textSecondary)),
        ],
      ),
    );
  }

  Widget _buildLedgerRow(String title, String desc, IconData icon, Color iconColor) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: iconColor, size: 14),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: iconColor),
              ),
              const SizedBox(height: 1),
              Text(
                desc,
                style: const TextStyle(fontSize: 9, color: Colors.white70, height: 1.25),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
