import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/services/auth_service.dart';
import '../../core/services/sync_service.dart';
import '../../core/theme/app_theme.dart';
import 'wellness_checkin_screen.dart';
import 'soldier_dossier_screen.dart';
import 'screen_time_screen.dart';
import 'self_assessment_screen.dart';


class SoldierDashboardScreen extends StatefulWidget {
  const SoldierDashboardScreen({super.key});

  @override
  State<SoldierDashboardScreen> createState() => _SoldierDashboardScreenState();
}

class _SoldierDashboardScreenState extends State<SoldierDashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = Provider.of<AuthService>(context, listen: false).currentUser;
      Provider.of<SyncService>(context, listen: false).fetchRemoteHistory(user?.uid);
    });
  }

  void _triggerSos() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: AppColors.rose, size: 28),
            SizedBox(width: 8),
            Text(
              'TRANSMIT SOS ALERT?',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.rose),
            ),
          ],
        ),
        content: const Text(
          'This will immediately escalate a Critical High-Risk Alert to your assigned Welfare Officer (Priya Sharma) and Formation Commander (Brig. Santosh Babu).',
          style: TextStyle(fontSize: 12, color: AppColors.textPrimary, height: 1.4),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel', style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.w700)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  backgroundColor: AppColors.rose,
                  content: Text(
                    '🚨 SOS TRANSMITTED! Welfare Officer & Command Alerted.',
                    style: TextStyle(fontWeight: FontWeight.w900),
                  ),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.rose,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('CONFIRM DISTRESS', style: TextStyle(fontWeight: FontWeight.w900)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);
    final sync = Provider.of<SyncService>(context);
    final user = auth.currentUser;

    // Calculate display stress score from last check-in or default 64
    double currentStress = 64.0;
    if (sync.history.isNotEmpty && sync.history.first.stressScore != null) {
      currentStress = sync.history.first.stressScore!;
    }

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            await sync.syncPendingQueue();
            await sync.fetchRemoteHistory(user?.uid);
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Top Soldier Profile Banner
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0B132B),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFF1C2541)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.25),
                        blurRadius: 15,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          // Soldier Info
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 22,
                                backgroundColor: const Color(0xFF1C2541),
                                child: Text(
                                  (user?.fullName.isNotEmpty == true) ? user!.fullName[0] : 'S',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF48CAE4),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    user?.fullName ?? 'Sepoy Amit Kumar',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 15,
                                      fontWeight: FontWeight.w900,
                                    ),
                                  ),
                                  Text(
                                    '${user?.rank ?? 'Sepoy / Commando'} • ${user?.unit ?? '10 Para SF'}',
                                    style: const TextStyle(
                                      color: Color(0xFF8D99AE),
                                      fontSize: 11,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),

                          // View Dossier Button
                          IconButton(
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(builder: (_) => const SoldierDossierScreen()),
                              );
                            },
                            icon: const Icon(Icons.contact_page_outlined, color: Color(0xFF48CAE4), size: 22),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // Connectivity & Sync Status Bar
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF141F38),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0xFF243354)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: sync.isOnline ? AppColors.emerald : AppColors.amber,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  sync.isOnline ? 'Online (Defense Gateway Connected)' : 'Offline (Local Telemetry Active)',
                                  style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700),
                                ),
                              ],
                            ),
                            if (sync.pendingCount > 0)
                              InkWell(
                                onTap: sync.isSyncing ? null : () => sync.syncPendingQueue(),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: AppColors.amber.withValues(alpha: 0.2),
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(color: AppColors.amber),
                                  ),
                                  child: Row(
                                    children: [
                                      if (sync.isSyncing)
                                        const SizedBox(
                                          width: 10,
                                          height: 10,
                                          child: CircularProgressIndicator(strokeWidth: 1.5, color: AppColors.amber),
                                        )
                                      else
                                        const Icon(Icons.sync, size: 12, color: AppColors.amber),
                                      const SizedBox(width: 4),
                                      Text(
                                        '${sync.pendingCount} Queued',
                                        style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: AppColors.amber),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Biometric Stress Score Dial Card
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'OPERATIONAL STRESS LEVEL',
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: currentStress > 75 ? AppColors.roseLight : AppColors.emeraldLight,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                currentStress > 75 ? 'HIGH RISK' : 'NOMINAL READINESS',
                                style: TextStyle(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w900,
                                  color: currentStress > 75 ? AppColors.rose : AppColors.emerald,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Dial Representation
                        Stack(
                          alignment: Alignment.center,
                          children: [
                            SizedBox(
                              width: 130,
                              height: 130,
                              child: CircularProgressIndicator(
                                value: currentStress / 100.0,
                                strokeWidth: 12,
                                backgroundColor: AppColors.background,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  currentStress > 75
                                      ? AppColors.rose
                                      : currentStress > 50
                                          ? AppColors.amber
                                          : AppColors.emerald,
                                ),
                              ),
                            ),
                            Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  '${currentStress.toStringAsFixed(0)}%',
                                  style: const TextStyle(
                                    fontSize: 28,
                                    fontWeight: FontWeight.w900,
                                    color: AppColors.textPrimary,
                                  ),
                                ),
                                const Text(
                                  'Stress Index',
                                  style: TextStyle(fontSize: 10, color: AppColors.textSecondary, fontWeight: FontWeight.w600),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Action Buttons: Log Check-in & SOS
                        Row(
                          children: [
                            Expanded(
                              flex: 2,
                              child: ElevatedButton.icon(
                                onPressed: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(builder: (_) => const WellnessCheckinScreen()),
                                  );
                                },
                                icon: const Icon(Icons.add_circle_outline, size: 16),
                                label: const Text('LOG DAILY CHECK-IN', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900)),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.accent,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              flex: 1,
                              child: ElevatedButton.icon(
                                onPressed: _triggerSos,
                                icon: const Icon(Icons.sos, size: 16),
                                label: const Text('SOS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900)),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.rose,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // AI Self-Assessment Adaptive Engine Launcher Card
                InkWell(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const SelfAssessmentScreen()),
                    );
                  },
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF132A52), Color(0xFF0F172A)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFF2563EB).withValues(alpha: 0.5)),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF2563EB).withValues(alpha: 0.15),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        )
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF2563EB).withValues(alpha: 0.25),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Icon(Icons.psychology, color: Color(0xFF60A5FA), size: 26),
                        ),
                        const SizedBox(width: 14),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    'AI Self-Assessment',
                                    style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w900),
                                  ),
                                  SizedBox(width: 6),
                                  Icon(Icons.arrow_forward_ios, color: Color(0xFF94A3B8), size: 12),
                                ],
                              ),
                              SizedBox(height: 2),
                              Text(
                                'Gemini Clinical AI • 12 Behavioral Domains',
                                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF2563EB).withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFF60A5FA)),
                          ),
                          child: const Text(
                            'GEMINI',
                            style: TextStyle(color: Color(0xFF60A5FA), fontSize: 9, fontWeight: FontWeight.w900),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // Dedicated Screen Time Monitor Launcher Card
                InkWell(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const ScreenTimeScreen()),
                    );
                  },
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFF334155)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0284C7).withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Icon(Icons.phonelink_ring, color: Color(0xFF38BDF8), size: 24),
                        ),
                        const SizedBox(width: 14),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    'Screen Time Monitor',
                                    style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w900),
                                  ),
                                  SizedBox(width: 6),
                                  Icon(Icons.arrow_forward_ios, color: Color(0xFF94A3B8), size: 12),
                                ],
                              ),
                              SizedBox(height: 2),
                              Text(
                                '5h 22m today • Night: 1h 35m • Sync to Welfare',
                                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.amber.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.amber.withValues(alpha: 0.4)),
                          ),
                          child: const Text(
                            'LIVE',
                            style: TextStyle(color: AppColors.amber, fontSize: 9, fontWeight: FontWeight.w900),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Recent Check-ins History
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'RECENT BIOMETRIC PULSE LOGS',
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5),
                    ),
                    Text(
                      '${sync.history.length} Recorded',
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.accent),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                if (sync.history.isEmpty)
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.cardBorder),
                    ),
                    child: const Center(
                      child: Text(
                        'No check-ins yet. Tap "Log Daily Check-in" above.',
                        style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                      ),
                    ),
                  )
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: sync.history.length > 5 ? 5 : sync.history.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 8),
                    itemBuilder: (context, idx) {
                      final h = sync.history[idx];
                      return Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.cardBorder),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: h.isSynced ? AppColors.emeraldLight : AppColors.amberLight,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(
                                h.isSynced ? Icons.cloud_done : Icons.cloud_off,
                                size: 18,
                                color: h.isSynced ? AppColors.emerald : AppColors.amber,
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
                                        'Sleep: ${h.sleepHours}h • Fatigue: ${h.fatigueLevel}/10',
                                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                                      ),
                                      const Spacer(),
                                      if (h.isSynced)
                                        const Text('SYNCED', style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: AppColors.emerald))
                                      else
                                        const Text('QUEUED', style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: AppColors.amber)),
                                    ],
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'Mood: ${h.moodScore}/10 • Workload: ${h.workloadPressure}/10 • ${h.consecutiveDutyDays} duty days',
                                    style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
