import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/services/auth_service.dart';
import '../../core/services/sync_service.dart';
import '../../core/theme/app_theme.dart';
import '../../models/wellness_model.dart';
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
  final ScrollController _scrollController = ScrollController();
  
  // Section GlobalKeys for smooth scrolling
  final GlobalKey _sec1Key = GlobalKey();
  final GlobalKey _sec2Key = GlobalKey();
  final GlobalKey _sec3Key = GlobalKey();
  final GlobalKey _sec4Key = GlobalKey();
  final GlobalKey _sec5Key = GlobalKey();

  int _selectedSectionNav = 0;

  // Quick Daily Check-in Form States
  double _quickSleepHours = 7.0;
  int _quickFatigueLevel = 4;
  int _quickMoodScore = 8;
  bool _isQuickSubmitting = false;

  // Box Breathing Exercise States
  bool _isBreathingActive = false;
  int _breathingPhaseIndex = 0; // 0: Inhale, 1: Hold, 2: Exhale, 3: Hold
  int _breathingSecondsLeft = 4;
  int _completedBreathingCycles = 0;
  Timer? _breathingTimer;

  final List<String> _breathingPhaseLabels = [
    'INHALE SLOWLY',
    'HOLD BREATH',
    'EXHALE SMOOTHLY',
    'HOLD EMPTY',
  ];

  final List<Color> _breathingPhaseColors = [
    AppColors.emerald,
    AppColors.accent,
    AppColors.secondary,
    AppColors.primary,
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = Provider.of<AuthService>(context, listen: false).currentUser;
      Provider.of<SyncService>(context, listen: false).fetchRemoteHistory(user?.uid);
    });
  }

  @override
  void dispose() {
    _breathingTimer?.cancel();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToSection(GlobalKey key, int navIndex) {
    setState(() => _selectedSectionNav = navIndex);
    final context = key.currentContext;
    if (context != null) {
      Scrollable.ensureVisible(
        context,
        duration: const Duration(milliseconds: 450),
        curve: Curves.easeInOut,
      );
    }
  }

  void _toggleBreathing() {
    if (_isBreathingActive) {
      _breathingTimer?.cancel();
      setState(() {
        _isBreathingActive = false;
        _breathingSecondsLeft = 4;
        _breathingPhaseIndex = 0;
      });
    } else {
      setState(() {
        _isBreathingActive = true;
        _breathingSecondsLeft = 4;
        _breathingPhaseIndex = 0;
      });
      _breathingTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (!mounted) return;
        setState(() {
          if (_breathingSecondsLeft > 1) {
            _breathingSecondsLeft--;
          } else {
            _breathingSecondsLeft = 4;
            if (_breathingPhaseIndex == 3) {
              _breathingPhaseIndex = 0;
              _completedBreathingCycles++;
            } else {
              _breathingPhaseIndex++;
            }
          }
        });
      });
    }
  }

  Future<void> _submitQuickCheckin() async {
    final auth = Provider.of<AuthService>(context, listen: false);
    final sync = Provider.of<SyncService>(context, listen: false);

    setState(() => _isQuickSubmitting = true);

    final item = WellnessAssessmentModel(
      personnelUid: auth.currentUser?.uid ?? 'UID-SLD-015',
      personnelName: auth.currentUser?.fullName ?? 'Sepoy Amit Kumar',
      sleepHours: _quickSleepHours,
      fatigueLevel: _quickFatigueLevel,
      moodScore: _quickMoodScore,
      workloadPressure: 5,
      physicalStrain: 4,
      consecutiveDutyDays: 3,
      notes: 'Quick check-in logged via Personnel Dashboard',
    );

    final res = await sync.submitCheckin(item);
    setState(() => _isQuickSubmitting = false);

    final bool isOffline = res['offline'] == true;

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: AppColors.primary,
          content: Row(
            children: [
              const Icon(Icons.check_circle, color: AppColors.accent, size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  !isOffline
                      ? 'Daily Check-in Transmitted & Synced to Welfare Command.'
                      : 'Saved Offline in Telemetry Queue. Will Sync on Defense Gateway.',
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 11),
                ),
              ),
            ],
          ),
          duration: const Duration(seconds: 4),
        ),
      );
    }
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

  Widget _buildSectionHeader({
    required String sectionNum,
    required String title,
    required IconData icon,
    String? subtitle,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.secondary,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                'SECTION $sectionNum',
                style: const TextStyle(
                  color: AppColors.accent,
                  fontSize: 9,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 0.6,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Icon(icon, size: 16, color: AppColors.primary),
            const SizedBox(width: 6),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  color: AppColors.textPrimary,
                  letterSpacing: -0.2,
                ),
              ),
            ),
          ],
        ),
        if (subtitle != null) ...[
          const SizedBox(height: 3),
          Padding(
            padding: const EdgeInsets.only(left: 2),
            child: Text(
              subtitle,
              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
            ),
          ),
        ],
        const SizedBox(height: 10),
      ],
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
    final double wellnessScore = (100.0 - currentStress).clamp(10.0, 98.0);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            await sync.syncPendingQueue();
            await sync.fetchRemoteHistory(user?.uid);
          },
          child: SingleChildScrollView(
            controller: _scrollController,
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // -------------------------------------------------------------
                // Soldier Profile & Operational Telemetry Header
                // -------------------------------------------------------------
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppColors.secondary, Color(0xFF0F2640)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.cardBorder.withValues(alpha: 0.2)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Row(
                              children: [
                                CircleAvatar(
                                  radius: 24,
                                  backgroundColor: AppColors.primary,
                                  child: Text(
                                    (user?.fullName.isNotEmpty == true) ? user!.fullName[0] : 'S',
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w900,
                                      color: AppColors.accent,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Flexible(
                                            child: Text(
                                              user?.fullName ?? 'Sepoy Amit Kumar',
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontSize: 15,
                                                fontWeight: FontWeight.w900,
                                              ),
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                          const SizedBox(width: 6),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                                            decoration: BoxDecoration(
                                              color: AppColors.accent,
                                              borderRadius: BorderRadius.circular(4),
                                            ),
                                            child: const Text(
                                              'PERSONNEL',
                                              style: TextStyle(
                                                color: AppColors.secondary,
                                                fontSize: 8,
                                                fontWeight: FontWeight.w900,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        '${user?.rank ?? 'Sepoy / Commando'} • ${user?.unit ?? '10 Para SF'} • UID-SLD-015',
                                        style: const TextStyle(
                                          color: Color(0xFFCBD5E1),
                                          fontSize: 11,
                                          fontWeight: FontWeight.w500,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            tooltip: 'View Full Dossier',
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(builder: (_) => const SoldierDossierScreen()),
                              );
                            },
                            icon: const Icon(Icons.badge_outlined, color: AppColors.accent, size: 24),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Telemetry Status Row
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.25),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 7,
                                  height: 7,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: sync.isOnline ? AppColors.emerald : AppColors.amber,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  sync.isOnline ? 'DEFENSE SECURE GATEWAY • LIVE' : 'LOCAL CACHE • OFFLINE',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 9,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ],
                            ),
                            if (sync.pendingCount > 0)
                              InkWell(
                                onTap: sync.isSyncing ? null : () => sync.syncPendingQueue(),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: AppColors.amber.withValues(alpha: 0.25),
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(color: AppColors.amber, width: 0.8),
                                  ),
                                  child: Row(
                                    children: [
                                      if (sync.isSyncing)
                                        const SizedBox(
                                          width: 8,
                                          height: 8,
                                          child: CircularProgressIndicator(strokeWidth: 1.2, color: AppColors.amber),
                                        )
                                      else
                                        const Icon(Icons.sync, size: 10, color: AppColors.amber),
                                      const SizedBox(width: 4),
                                      Text(
                                        '${sync.pendingCount} QUEUED',
                                        style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: AppColors.amber),
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
                const SizedBox(height: 12),

                // -------------------------------------------------------------
                // Quick 5-Section Jump Navigation Bar
                // -------------------------------------------------------------
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildNavPill(0, '1. Wellness Score', Icons.health_and_safety, () => _scrollToSection(_sec1Key, 0)),
                      const SizedBox(width: 6),
                      _buildNavPill(1, '2. Daily Check-in', Icons.check_circle_outline, () => _scrollToSection(_sec2Key, 1)),
                      const SizedBox(width: 6),
                      _buildNavPill(2, '3. AI Insights', Icons.psychology, () => _scrollToSection(_sec3Key, 2)),
                      const SizedBox(width: 6),
                      _buildNavPill(3, '4. Activities', Icons.self_improvement, () => _scrollToSection(_sec4Key, 3)),
                      const SizedBox(width: 6),
                      _buildNavPill(4, '5. Progress', Icons.trending_up, () => _scrollToSection(_sec5Key, 4)),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // =============================================================
                // SECTION 1: WELLNESS SCORE
                // =============================================================
                Container(key: _sec1Key),
                _buildSectionHeader(
                  sectionNum: '1',
                  title: 'Wellness Score',
                  icon: Icons.health_and_safety_outlined,
                  subtitle: 'Real-time physiological readiness & operational stress dial',
                ),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(18),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'OPERATIONAL COMBAT READINESS',
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
                        const SizedBox(height: 18),

                        // Dial Representation
                        Stack(
                          alignment: Alignment.center,
                          children: [
                            SizedBox(
                              width: 140,
                              height: 140,
                              child: CircularProgressIndicator(
                                value: (wellnessScore / 100.0),
                                strokeWidth: 14,
                                backgroundColor: AppColors.cardBorder.withValues(alpha: 0.6),
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  wellnessScore >= 70
                                      ? AppColors.primary
                                      : wellnessScore >= 50
                                          ? AppColors.accent
                                          : AppColors.rose,
                                ),
                              ),
                            ),
                            Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  wellnessScore.toStringAsFixed(0),
                                  style: const TextStyle(
                                    fontSize: 34,
                                    fontWeight: FontWeight.w900,
                                    color: AppColors.textPrimary,
                                    letterSpacing: -1,
                                  ),
                                ),
                                const Text(
                                  'WELLNESS INDEX',
                                  style: TextStyle(
                                    fontSize: 9,
                                    color: AppColors.textSecondary,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Triad Telemetry Metrics
                        Row(
                          children: [
                            Expanded(
                              child: _buildMiniMetric(
                                label: 'HRV Rest',
                                value: '72 ms',
                                icon: Icons.favorite_border,
                                color: AppColors.emerald,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: _buildMiniMetric(
                                label: 'Sleep Quality',
                                value: '86%',
                                icon: Icons.bedtime_outlined,
                                color: AppColors.secondary,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: _buildMiniMetric(
                                label: 'Recovery',
                                value: 'Optimal',
                                icon: Icons.bolt,
                                color: AppColors.accent,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // SOS Distress Transmission Action
                        OutlinedButton.icon(
                          onPressed: _triggerSos,
                          icon: const Icon(Icons.warning_amber_rounded, size: 16, color: AppColors.rose),
                          label: const Text(
                            'TRANSMIT EMERGENCY SOS TO COMMAND',
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.rose),
                          ),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppColors.rose, width: 1.2),
                            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 2: DAILY CHECK-IN
                // =============================================================
                Container(key: _sec2Key),
                _buildSectionHeader(
                  sectionNum: '2',
                  title: 'Daily Check-in',
                  icon: Icons.check_circle_outline,
                  subtitle: 'Quick behavioral logging & subjective health parameters',
                ),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(18),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'TODAY\'S PULSE SUBMISSION',
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary),
                            ),
                            Text(
                              sync.history.isNotEmpty ? 'Last: Today' : 'Pending',
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.primary),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),

                        // Sleep Slider
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Sleep Duration', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                            Text('${_quickSleepHours.toStringAsFixed(1)} hrs',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.primary)),
                          ],
                        ),
                        Slider(
                          value: _quickSleepHours,
                          min: 3.0,
                          max: 11.0,
                          divisions: 16,
                          activeColor: AppColors.primary,
                          inactiveColor: AppColors.cardBorder,
                          onChanged: (val) => setState(() => _quickSleepHours = val),
                        ),

                        // Fatigue Level
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Fatigue Level (1-10)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                            Text('Level $_quickFatigueLevel',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.secondary)),
                          ],
                        ),
                        Slider(
                          value: _quickFatigueLevel.toDouble(),
                          min: 1,
                          max: 10,
                          divisions: 9,
                          activeColor: AppColors.secondary,
                          inactiveColor: AppColors.cardBorder,
                          onChanged: (val) => setState(() => _quickFatigueLevel = val.round()),
                        ),

                        // Mood Score
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Mood / Morale (1-10)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                            Text('$_quickMoodScore / 10',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.accent)),
                          ],
                        ),
                        Slider(
                          value: _quickMoodScore.toDouble(),
                          min: 1,
                          max: 10,
                          divisions: 9,
                          activeColor: AppColors.accent,
                          inactiveColor: AppColors.cardBorder,
                          onChanged: (val) => setState(() => _quickMoodScore = val.round()),
                        ),
                        const SizedBox(height: 10),

                        // Submit Quick Check-in Button
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: _isQuickSubmitting ? null : _submitQuickCheckin,
                            icon: _isQuickSubmitting
                                ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                : const Icon(Icons.send_rounded, size: 16),
                            label: Text(
                              _isQuickSubmitting ? 'TRANSMITTING...' : 'LOG QUICK CHECK-IN',
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),

                        // Open Comprehensive Check-in Screen
                        Center(
                          child: TextButton.icon(
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(builder: (_) => const WellnessCheckinScreen()),
                              );
                            },
                            icon: const Icon(Icons.tune, size: 14, color: AppColors.secondary),
                            label: const Text(
                              'Open Detailed 6-Factor Assessment Form',
                              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.secondary),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 3: AI WELLNESS INSIGHTS
                // =============================================================
                Container(key: _sec3Key),
                _buildSectionHeader(
                  sectionNum: '3',
                  title: 'AI Wellness Insights',
                  icon: Icons.psychology,
                  subtitle: 'Gemini Clinical AI predictive behavioral & recovery models',
                ),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppColors.secondary, Color(0xFF0F2640)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.accent.withValues(alpha: 0.4)),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.secondary.withValues(alpha: 0.2),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: AppColors.accent.withValues(alpha: 0.2),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Icon(Icons.auto_awesome, color: AppColors.accent, size: 18),
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'CLINICAL INTELLIGENCE BRIEF',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 0.6,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.accent,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text(
                              'GEMINI 1.5 PRO',
                              style: TextStyle(
                                color: AppColors.secondary,
                                fontSize: 8,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      _buildAiInsightCard(
                        icon: Icons.nights_stay,
                        title: 'Circadian Sleep Rhythm Optimization',
                        desc: 'Cumulative 48h sleep deficit is approximately 1.4h. Prioritize darkness in barracks 45m before scheduled taps to restore rapid eye movement phases.',
                        badge: 'RECOVERY',
                        badgeColor: AppColors.emerald,
                      ),
                      const SizedBox(height: 10),

                      _buildAiInsightCard(
                        icon: Icons.water_drop,
                        title: 'Physical Stamina & Hydration Guidance',
                        desc: 'Electrolyte depletion index projected at 22% during extended mountain drills. Supplement oral rehydration salts before high-altitude march.',
                        badge: 'PHYSIOLOGY',
                        badgeColor: AppColors.accent,
                      ),
                      const SizedBox(height: 10),

                      _buildAiInsightCard(
                        icon: Icons.psychology_alt,
                        title: 'Cognitive Steadiness Under Load',
                        desc: 'Reflex velocity remains in optimal 88th percentile. Psychological burnout markers are nominal for the current 4-day tactical rotation.',
                        badge: 'TACTICAL',
                        badgeColor: const Color(0xFF60A5FA),
                      ),
                      const SizedBox(height: 14),

                      // Launcher for Full Gemini AI Self-Assessment
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const SelfAssessmentScreen()),
                            );
                          },
                          icon: const Icon(Icons.psychology, size: 16),
                          label: const Text(
                            'LAUNCH 12-DOMAIN AI SELF-ASSESSMENT',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.accent,
                            foregroundColor: AppColors.secondary,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 4: WELLNESS ACTIVITIES
                // =============================================================
                Container(key: _sec4Key),
                _buildSectionHeader(
                  sectionNum: '4',
                  title: 'Wellness Activities',
                  icon: Icons.self_improvement,
                  subtitle: 'Pranayama box breathing, tactical decompression & counselor link',
                ),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(18),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'INTERACTIVE TACTICAL BOX BREATHING (4-4-4-4)',
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary),
                            ),
                            Text(
                              'Cycles: $_completedBreathingCycles',
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.primary),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),

                        // Interactive Box Breathing Widget
                        Center(
                          child: Column(
                            children: [
                              Container(
                                width: 130,
                                height: 130,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: _breathingPhaseColors[_breathingPhaseIndex].withValues(alpha: 0.12),
                                  border: Border.all(
                                    color: _breathingPhaseColors[_breathingPhaseIndex],
                                    width: _isBreathingActive ? 4 : 2,
                                  ),
                                ),
                                child: Center(
                                  child: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        _isBreathingActive ? _breathingSecondsLeft.toString() : '4-4-4-4',
                                        style: TextStyle(
                                          fontSize: 28,
                                          fontWeight: FontWeight.w900,
                                          color: _breathingPhaseColors[_breathingPhaseIndex],
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        _isBreathingActive
                                            ? _breathingPhaseLabels[_breathingPhaseIndex]
                                            : 'PRANAYAMA',
                                        style: TextStyle(
                                          fontSize: 9,
                                          fontWeight: FontWeight.w800,
                                          color: _breathingPhaseColors[_breathingPhaseIndex],
                                          letterSpacing: 0.5,
                                        ),
                                        textAlign: TextAlign.center,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),
                              ElevatedButton.icon(
                                onPressed: _toggleBreathing,
                                icon: Icon(_isBreathingActive ? Icons.pause : Icons.play_arrow, size: 16),
                                label: Text(
                                  _isBreathingActive ? 'PAUSE DRILL' : 'START 4-MIN BOX BREATHING',
                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
                                ),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: _isBreathingActive ? AppColors.secondary : AppColors.primary,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Divider(color: AppColors.cardBorder),
                        const SizedBox(height: 12),

                        // Activity 2: Tactical Decompression
                        _buildActivityItem(
                          title: '5-Min Post-Patrol Muscle Decompression',
                          desc: 'Spine stretch, hamstring release and shoulder rotations for counteracting kit load.',
                          icon: Icons.fitness_center,
                          badge: 'STRETCH',
                        ),
                        const SizedBox(height: 10),

                        // Activity 3: Barracks Sleep Hygiene
                        _buildActivityItem(
                          title: 'Barracks Sleep Conditioning Protocol',
                          desc: 'Darkened room adaptation, acoustic silence earplugs and zero caffeine post 18:00 hrs.',
                          icon: Icons.bedtime,
                          badge: 'SLEEP',
                        ),
                        const SizedBox(height: 10),

                        // Activity 4: Confidential Welfare Counselor Connect
                        _buildActivityItem(
                          title: 'Confidential Welfare Officer Connect',
                          desc: 'Request a discreet, zero-stigma confidential counseling session with Priya Sharma.',
                          icon: Icons.support_agent,
                          badge: 'COUNSEL',
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                backgroundColor: AppColors.secondary,
                                content: Text(
                                  'Counseling request logged. Assigned Welfare Officer Priya Sharma will contact you discreetly.',
                                  style: TextStyle(fontWeight: FontWeight.w700),
                                ),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 5: PERSONAL PROGRESS
                // =============================================================
                Container(key: _sec5Key),
                _buildSectionHeader(
                  sectionNum: '5',
                  title: 'Personal Progress',
                  icon: Icons.trending_up,
                  subtitle: 'Historical biometric telemetry, discipline streaks & device hygiene',
                ),

                // Streak Banner Card
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.accent.withValues(alpha: 0.6)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppColors.accent.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.local_fire_department, color: AppColors.accent, size: 24),
                      ),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '6-DAY DISCIPLINE STREAK',
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Consecutive daily wellness pulses recorded. Commendation badge unlocked.',
                              style: TextStyle(fontSize: 10, color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'HONOR',
                          style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w900),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // Screen Time Monitor Integration
                InkWell(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const ScreenTimeScreen()),
                    );
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.cardBorder),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.primaryLight,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.phonelink_ring, color: AppColors.primary, size: 20),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Screen Time & Device Hygiene',
                                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                              ),
                              SizedBox(height: 2),
                              Text(
                                '5h 22m today • 1h 35m nocturnal usage • Sync to Welfare',
                                style: TextStyle(fontSize: 10, color: AppColors.textSecondary),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.textSecondary),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Recent Pulse Logs List
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'RECENT BIOMETRIC PULSE LOGS',
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5),
                    ),
                    Text(
                      '${sync.history.length} Recorded',
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.primary),
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
                        'No telemetry pulses recorded yet. Use Section 2 to log your first daily check-in.',
                        style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                        textAlign: TextAlign.center,
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
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.cardBorder),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: h.isSynced ? AppColors.emeraldLight : AppColors.amberLight,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Icon(
                                h.isSynced ? Icons.cloud_done : Icons.cloud_off,
                                size: 16,
                                color: h.isSynced ? AppColors.emerald : AppColors.amber,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        'Sleep: ${h.sleepHours}h • Fatigue: ${h.fatigueLevel}/10',
                                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
                                      ),
                                      const Spacer(),
                                      Text(
                                        h.isSynced ? 'SYNCED' : 'QUEUED',
                                        style: TextStyle(
                                          fontSize: 8,
                                          fontWeight: FontWeight.w900,
                                          color: h.isSynced ? AppColors.emerald : AppColors.amber,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'Mood: ${h.moodScore}/10 • Workload: ${h.workloadPressure}/10 • ${h.consecutiveDutyDays} duty days',
                                    style: const TextStyle(fontSize: 9, color: AppColors.textSecondary),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavPill(int index, String label, IconData icon, VoidCallback onTap) {
    final bool isSelected = _selectedSectionNav == index;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.cardBorder,
            width: 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.primary.withValues(alpha: 0.2),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  )
                ]
              : null,
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 13,
              color: isSelected ? AppColors.accent : AppColors.textSecondary,
            ),
            const SizedBox(width: 5),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.w900 : FontWeight.w700,
                color: isSelected ? Colors.white : AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMiniMetric({
    required String label,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
          ),
          Text(
            label,
            style: const TextStyle(fontSize: 9, color: AppColors.textSecondary, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildAiInsightCard({
    required IconData icon,
    required String title,
    required String desc,
    required String badge,
    required Color badgeColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: badgeColor.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: badgeColor, size: 16),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Flexible(
                      child: Text(
                        title,
                        style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                      decoration: BoxDecoration(
                        color: badgeColor.withValues(alpha: 0.25),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: badgeColor, width: 0.6),
                      ),
                      child: Text(
                        badge,
                        style: TextStyle(color: badgeColor, fontSize: 7, fontWeight: FontWeight.w900),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  desc,
                  style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 10, height: 1.3),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActivityItem({
    required String title,
    required String desc,
    required IconData icon,
    required String badge,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.primaryLight,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: AppColors.primary, size: 18),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    desc,
                    style: const TextStyle(fontSize: 9, color: AppColors.textSecondary),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.secondaryLight,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                badge,
                style: const TextStyle(color: AppColors.secondary, fontSize: 8, fontWeight: FontWeight.w900),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
