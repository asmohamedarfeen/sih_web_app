import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/services/auth_service.dart';
import '../../core/services/sync_service.dart';
import '../../core/services/localization_service.dart';
import '../../core/widgets/language_selector_sheet.dart';
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

  // Filter / Jump navigation keys
  final GlobalKey _overviewKey = GlobalKey();
  final GlobalKey _aiCoachKey = GlobalKey();
  final GlobalKey _readinessKey = GlobalKey();
  final GlobalKey _healthKey = GlobalKey();
  final GlobalKey _supportKey = GlobalKey();

  int _selectedNavIndex = 0;

  // Interactive State for Challenges & Priorities
  double _waterDrankLiters = 1.4;
  final double _waterTargetLiters = 2.0;
  final Set<int> _completedPriorities = {1}; // 1: Box breathing done
  int _selectedMoodIndex = 5; // Saturday 😀

  // Quick Daily Check-in Form States
  double _quickSleepHours = 7.7;
  int _quickFatigueLevel = 3;
  int _quickMoodScore = 9;
  bool _isQuickSubmitting = false;
  int _trustLedgerTab = 0; // 0: Firewall Matrix, 1: SHA-256 Audit Log, 2: Safe Harbor

  // Box Breathing Exercise States (4-4-4-4)
  bool _isBreathingActive = false;
  int _breathingPhaseIndex = 0; // 0: Inhale, 1: Hold, 2: Exhale, 3: Hold
  int _breathingSecondsLeft = 4;
  int _completedBreathingCycles = 2;
  Timer? _breathingTimer;

  final List<String> _breathingPhaseLabels = [
    'INHALE DEEP (4s)',
    'HOLD FULL (4s)',
    'EXHALE SMOOTH (4s)',
    'HOLD EMPTY (4s)',
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

  void _scrollToKey(GlobalKey key, int navIndex) {
    setState(() => _selectedNavIndex = navIndex);
    final ctx = key.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(
        ctx,
        duration: const Duration(milliseconds: 400),
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
              _completedPriorities.add(1);
            } else {
              _breathingPhaseIndex++;
            }
          }
        });
      });
    }
  }

  void _addWater(double amount) {
    setState(() {
      _waterDrankLiters = (_waterDrankLiters + amount).clamp(0.0, 3.5);
      if (_waterDrankLiters >= _waterTargetLiters) {
        _completedPriorities.add(0);
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: AppColors.secondary,
        duration: const Duration(seconds: 2),
        content: Row(
          children: [
            const Icon(Icons.water_drop, color: Colors.lightBlueAccent, size: 18),
            const SizedBox(width: 8),
            Text(
              '+${(amount * 1000).toInt()}ml logged. Total: ${_waterDrankLiters.toStringAsFixed(1)}L / ${_waterTargetLiters.toStringAsFixed(1)}L',
              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _submitQuickCheckin() async {
    final auth = Provider.of<AuthService>(context, listen: false);
    final sync = Provider.of<SyncService>(context, listen: false);

    setState(() => _isQuickSubmitting = true);

    final item = WellnessAssessmentModel(
      personnelUid: auth.currentUser?.uid ?? 'UID-SLD-015',
      personnelName: auth.currentUser?.fullName ?? 'Rifleman Arjun',
      sleepHours: _quickSleepHours,
      fatigueLevel: _quickFatigueLevel,
      moodScore: _quickMoodScore,
      workloadPressure: 4,
      physicalStrain: 3,
      consecutiveDutyDays: 4,
      notes: 'Logged via AI Welfare Companion',
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
                      ? 'Daily Pulse Transmitted & Synced to Welfare Command.'
                      : 'Saved in Local Queue. Will sync automatically on Gateway reconnect.',
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
            Icon(Icons.emergency_outlined, color: AppColors.rose, size: 28),
            SizedBox(width: 10),
            Expanded(
              child: Text(
                'EMERGENCY WELFARE SUPPORT',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppColors.rose),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Immediate 24/7 confidential assistance for Armed Forces personnel.',
              style: TextStyle(fontSize: 12, color: AppColors.textPrimary, height: 1.4),
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.roseLight,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.rose.withValues(alpha: 0.3)),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.phone_in_talk, color: AppColors.rose, size: 16),
                      SizedBox(width: 6),
                      Text(
                        'Defense Crisis Helpline: 1800-11-0023',
                        style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, color: AppColors.rose),
                      ),
                    ],
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Tele-MANAS Armed Forces Cell (Toll-Free • 24x7)',
                    style: TextStyle(fontSize: 10, color: AppColors.textSecondary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Confirming will also notify your designated Unit Welfare Officer (Priya Sharma) discreetly for immediate check-in.',
              style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel', style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.w700)),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.of(ctx).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  backgroundColor: AppColors.rose,
                  content: Row(
                    children: [
                      Icon(Icons.notification_important, color: Colors.white),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          '🚨 Emergency Welfare Request Transmitted! Dedicated counselor will reach you.',
                          style: TextStyle(fontWeight: FontWeight.w900, fontSize: 11),
                        ),
                      ),
                    ],
                  ),
                  duration: Duration(seconds: 5),
                ),
              );
            },
            icon: const Icon(Icons.send_rounded, size: 16),
            label: const Text('CALL WELFARE HELPLINE', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 11)),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.rose,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }

  void _showAiChatModal() {
    final TextEditingController chatController = TextEditingController();
    final List<Map<String, String>> chatMessages = [
      {
        'sender': 'ai',
        'text': 'Jai Hind, Rifleman Arjun! I am your AI Welfare Companion. How can I assist your physical recovery or mental readiness today?'
      },
      {
        'sender': 'user',
        'text': 'How can I reduce stress after long patrol duties?'
      },
      {
        'sender': 'ai',
        'text': 'Recommended protocol: (1) 4-minute box breathing right after kit de-rigging, (2) hydrate with 500ml electrolyte water, (3) 15-minute darkness adaptation in barracks before taps to lower cortisol.'
      },
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.78,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom + 16,
                top: 16,
                left: 16,
                right: 16,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 44,
                      height: 5,
                      decoration: BoxDecoration(
                        color: AppColors.cardBorder,
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.secondary,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.psychology, color: AppColors.accent, size: 20),
                      ),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'AI Welfare Companion',
                              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppColors.secondary),
                            ),
                            Text(
                              'Indian Armed Forces Defense Clinical AI Assistant',
                              style: TextStyle(fontSize: 10, color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: () => Navigator.of(ctx).pop(),
                        icon: const Icon(Icons.close, size: 20),
                      ),
                    ],
                  ),
                  const Divider(height: 20),

                  // Quick Suggestion Chips
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildPromptChip(
                          'How to improve deep sleep?',
                          () {
                            setSheetState(() {
                              chatMessages.add({'sender': 'user', 'text': 'How to improve deep sleep?'});
                              chatMessages.add({
                                'sender': 'ai',
                                'text': 'Aim to cut off caffeine by 17:00 hrs. Ensure the barracks ventilation is clear and try sleeping at 22:30 tonight as prioritized.'
                              });
                            });
                          },
                        ),
                        const SizedBox(width: 6),
                        _buildPromptChip(
                          'Explain my 92% readiness',
                          () {
                            setSheetState(() {
                              chatMessages.add({'sender': 'user', 'text': 'Explain my 92% readiness'});
                              chatMessages.add({
                                'sender': 'ai',
                                'text': 'Your Mission Readiness is 92% (Optimal). Sleep duration (7h 42m) and recovery (88%) are excellent. Hydration (1.4L) is the only metric slightly lagging.'
                              });
                            });
                          },
                        ),
                        const SizedBox(width: 6),
                        _buildPromptChip(
                          'Breathing tips for drills',
                          () {
                            setSheetState(() {
                              chatMessages.add({'sender': 'user', 'text': 'Breathing tips for drills'});
                              chatMessages.add({
                                'sender': 'ai',
                                'text': 'Use 4-4-4-4 box breathing to control heart rate spikes before tactical exercises or firing drills.'
                              });
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Chat Messages
                  Expanded(
                    child: ListView.separated(
                      itemCount: chatMessages.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 10),
                      itemBuilder: (c, idx) {
                        final msg = chatMessages[idx];
                        final isUser = msg['sender'] == 'user';
                        return Align(
                          alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                          child: Container(
                            constraints: BoxConstraints(maxWidth: MediaQuery.of(c).size.width * 0.78),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            decoration: BoxDecoration(
                              color: isUser ? AppColors.secondary : AppColors.background,
                              borderRadius: BorderRadius.circular(16).copyWith(
                                bottomRight: isUser ? const Radius.circular(0) : const Radius.circular(16),
                                bottomLeft: !isUser ? const Radius.circular(0) : const Radius.circular(16),
                              ),
                              border: Border.all(
                                color: isUser ? AppColors.secondary : AppColors.cardBorder,
                              ),
                            ),
                            child: Text(
                              msg['text'] ?? '',
                              style: TextStyle(
                                fontSize: 12,
                                height: 1.35,
                                color: isUser ? Colors.white : AppColors.textPrimary,
                                fontWeight: isUser ? FontWeight.w600 : FontWeight.w500,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),

                  // Input bar
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: chatController,
                          style: const TextStyle(fontSize: 12),
                          decoration: InputDecoration(
                            hintText: 'Ask AI (e.g. recovery tips, stress relief)...',
                            hintStyle: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                            filled: true,
                            fillColor: AppColors.background,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(24),
                              borderSide: const BorderSide(color: AppColors.cardBorder),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(24),
                              borderSide: const BorderSide(color: AppColors.cardBorder),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      CircleAvatar(
                        backgroundColor: AppColors.secondary,
                        child: IconButton(
                          icon: const Icon(Icons.send, color: AppColors.accent, size: 16),
                          onPressed: () {
                            if (chatController.text.trim().isEmpty) return;
                            final query = chatController.text.trim();
                            chatController.clear();
                            setSheetState(() {
                              chatMessages.add({'sender': 'user', 'text': query});
                              chatMessages.add({
                                'sender': 'ai',
                                'text': 'Understood. Maintaining consistent barracks sleep routines and logging daily check-ins helps ensure peak tactical welfare and mission readiness.'
                              });
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildPromptChip(String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: AppColors.secondaryLight,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.secondary.withValues(alpha: 0.2)),
        ),
        child: Text(
          label,
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.secondary),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);
    final sync = Provider.of<SyncService>(context);
    final user = auth.currentUser;

    // Soldier Name fallback per plan.md
    final String soldierName = (user != null && user.fullName.isNotEmpty) ? user.fullName : 'Rifleman Arjun';

    return Scaffold(
      backgroundColor: AppColors.background,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAiChatModal,
        backgroundColor: AppColors.secondary,
        foregroundColor: Colors.white,
        elevation: 6,
        icon: const Icon(Icons.auto_awesome, color: AppColors.accent, size: 18),
        label: const Text(
          'Ask AI',
          style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 0.3),
        ),
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            await sync.syncPendingQueue();
            await sync.fetchRemoteHistory(user?.uid);
          },
          child: SingleChildScrollView(
            controller: _scrollController,
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Quick Navigation Filter Bar
                _buildQuickNavHeader(),
                const SizedBox(height: 16),

                // =============================================================
                // SECTION 1: PERSONALIZED HOME SCREEN & AI WELLNESS SCORE
                // =============================================================
                Container(key: _overviewKey),
                _buildSectionTitleBadge('1', 'Personalized Home Screen', 'AI-Powered Wellness Status'),
                _buildPersonalizedHeaderCard(soldierName, sync),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 2: TODAY'S AI SUMMARY
                // =============================================================
                _buildSectionTitleBadge('2', 'AI Daily Summary', 'Executive Overview in Seconds'),
                _buildAiDailySummaryCard(),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 3 & SECTION 17: AI WELLNESS COACH & DAILY MOTIVATION
                // =============================================================
                Container(key: _aiCoachKey),
                _buildSectionTitleBadge('3 & 17', 'AI Wellness Coach & Daily Motivation', 'Personal Guidance & Mindset'),
                _buildAiCoachCard(),
                const SizedBox(height: 12),
                _buildDailyMotivationCard(),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 10 & SECTION 19: TODAY'S PRIORITIES & CHALLENGES
                // =============================================================
                _buildSectionTitleBadge('10 & 19', 'Today\'s Priorities & Challenges', 'Actionable Daily Guidance'),
                _buildPrioritiesAndChallengesCard(),
                const SizedBox(height: 14),

                // Interactive Box Breathing (4-4-4-4)
                _buildInteractiveBoxBreathingCard(),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 5: WELLNESS JOURNEY
                // =============================================================
                _buildSectionTitleBadge('5', 'Wellness Journey', 'Long-term Progression: 68 → 74 → 84'),
                _buildWellnessJourneyCard(),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 11 & SECTION 12: WEEKLY WELLNESS TREND & GROWTH
                // =============================================================
                _buildSectionTitleBadge('11 & 12', 'Weekly Wellness Trend & Growth', 'Positive Reinforcement & Patterns'),
                _buildWeeklyTrendCard(),
                const SizedBox(height: 12),
                _buildPersonalGrowthCard(),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 4: MOOD TIMELINE
                // =============================================================
                _buildSectionTitleBadge('4', 'Mood Timeline', 'Visual Emotional Tracking'),
                _buildMoodTimelineCard(),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 9 & SECTION 15: RISK BREAKDOWN & EXPLAINABLE AI
                // =============================================================
                Container(key: _readinessKey),
                _buildSectionTitleBadge('9 & 15', 'Risk Breakdown & Explainable AI', 'Transparent Root Causes'),
                _buildRiskBreakdownCard(),
                const SizedBox(height: 12),
                _buildExplainableAiCard(),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 8: MISSION READINESS GAUGE
                // =============================================================
                _buildSectionTitleBadge('8', 'Mission Readiness', 'Operational Capability Index'),
                _buildMissionReadinessCard(),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 20 & SECTION 23: SLEEP DASHBOARD & RECOVERY SCORE
                // =============================================================
                Container(key: _healthKey),
                _buildSectionTitleBadge('20 & 23', 'Sleep Dashboard & Recovery Score', 'Restorative Sleep & Physiological Recovery'),
                _buildSleepDashboardCard(),
                const SizedBox(height: 12),
                _buildRecoveryScoreCard(),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 21 & SECTION 22: ACTIVITY DASHBOARD & NUTRITION
                // =============================================================
                _buildSectionTitleBadge('21 & 22', 'Activity & Nutrition Summary', 'Physical Drill & Sustenance Tracking'),
                _buildActivityAndNutritionCard(),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 6 & SECTION 7: STREAKS & ACHIEVEMENT BADGES
                // =============================================================
                _buildSectionTitleBadge('6 & 7', 'Daily Wellness Streak & Badges', 'Gamified Habit Formation'),
                _buildStreaksAndBadgesCard(),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 13: QUICK ACTIONS GRID
                // =============================================================
                _buildSectionTitleBadge('13', 'Quick Actions', 'One-Tap Access to Operations'),
                _buildQuickActionsGrid(),
                const SizedBox(height: 20),

                // Quick Pulse Submission Bar (Retained for sync pipeline)
                _buildQuickCheckinFormCard(sync),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 14 & SECTION 18: ANONYMOUS SUPPORT & EMERGENCY SOS
                // =============================================================
                Container(key: _supportKey),
                _buildSectionTitleBadge('14 & 18', 'Welfare & Emergency Support', '100% Confidential Care & Rapid Assistance'),
                _buildEmergencySupportCard(),
                const SizedBox(height: 12),
                _buildAnonymousSupportCard(),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 16: WELLNESS CALENDAR
                // =============================================================
                _buildSectionTitleBadge('16', 'Wellness Calendar', 'Monthly Wellness History Grid'),
                _buildWellnessCalendarCard(),
                const SizedBox(height: 20),

                // =============================================================
                // SECTION 25: PRIVACY CARD
                // =============================================================
                _buildSectionTitleBadge('25', 'Privacy & Protection Card', 'Defense Compliance & Data Trust'),
                _buildPrivacyCard(),
                const SizedBox(height: 80), // Padding for Floating Action Button
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Helper: Section Title Header with Clean Badge
  // ---------------------------------------------------------------------------
  Widget _buildSectionTitleBadge(String secNum, String title, String subtitle) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10, top: 4),
      child: Column(
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
                  'SECTION $secNum',
                  style: const TextStyle(
                    color: AppColors.accent,
                    fontSize: 9,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: AppColors.textPrimary,
                    letterSpacing: -0.2,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          Padding(
            padding: const EdgeInsets.only(left: 2),
            child: Text(
              subtitle,
              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Quick Jump Navigation Pill Row
  // ---------------------------------------------------------------------------
  Widget _buildQuickNavHeader() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _buildNavPill(0, 'Overview', Icons.home_filled, () => _scrollToKey(_overviewKey, 0)),
          const SizedBox(width: 6),
          _buildNavPill(1, 'AI Coach', Icons.psychology, () => _scrollToKey(_aiCoachKey, 1)),
          const SizedBox(width: 6),
          _buildNavPill(2, 'Readiness & Risk', Icons.shield_outlined, () => _scrollToKey(_readinessKey, 2)),
          const SizedBox(width: 6),
          _buildNavPill(3, 'Sleep & Recovery', Icons.bedtime_outlined, () => _scrollToKey(_healthKey, 3)),
          const SizedBox(width: 6),
          _buildNavPill(4, 'Support & SOS', Icons.health_and_safety_outlined, () => _scrollToKey(_supportKey, 4)),
        ],
      ),
    );
  }

  Widget _buildNavPill(int index, String label, IconData icon, VoidCallback onTap) {
    final isSelected = _selectedNavIndex == index;
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
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.primary.withValues(alpha: 0.25),
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

  // ---------------------------------------------------------------------------
  // SECTION 1: PERSONALIZED HOME SCREEN CARD
  // ---------------------------------------------------------------------------
  Widget _buildPersonalizedHeaderCard(String soldierName, SyncService sync) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.secondary, Color(0xFF0F2640)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.accent.withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(
            color: AppColors.secondary.withValues(alpha: 0.3),
            blurRadius: 14,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting Row
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Good Morning,',
                      style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 13, fontWeight: FontWeight.w500),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      soldierName,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.3,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    const Text(
                      '10 Para SF • INF-9412',
                      style: TextStyle(color: AppColors.accent, fontSize: 11, fontWeight: FontWeight.w700),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Language Selector Action Pill
                  InkWell(
                    onTap: () => LanguageSelectorSheet.show(context),
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white24),
                      ),
                      child: Consumer<LocalizationService>(
                        builder: (ctx, loc, _) => Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(loc.currentLanguageModel.flag, style: const TextStyle(fontSize: 13)),
                            const SizedBox(width: 4),
                            Text(
                              loc.currentLanguageModel.code.toUpperCase(),
                              style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900),
                            ),
                            const Icon(Icons.keyboard_arrow_down, color: Colors.white70, size: 14),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  IconButton(
                    tooltip: 'View Full Dossier',
                    padding: const EdgeInsets.all(4),
                    constraints: const BoxConstraints(),
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const SoldierDossierScreen()),
                      );
                    },
                    icon: const Icon(Icons.badge_outlined, color: AppColors.accent, size: 22),
                  ),
                  const SizedBox(width: 6),
                  InkWell(
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const SoldierDossierScreen()),
                      );
                    },
                    borderRadius: BorderRadius.circular(22),
                    child: CircleAvatar(
                      radius: 22,
                      backgroundColor: AppColors.primary,
                      child: Text(
                        soldierName.isNotEmpty ? soldierName[0] : 'A',
                        style: const TextStyle(color: AppColors.accent, fontSize: 18, fontWeight: FontWeight.w900),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const Divider(color: Colors.white12, height: 24),

          // AI Wellness Score Hero Metric
          Row(
            children: [
              // Radial / Circle Indicator
              Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.08),
                  border: Border.all(color: AppColors.emerald, width: 4),
                ),
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '84',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: -1,
                      ),
                    ),
                    Text(
                      '/ 100',
                      style: TextStyle(
                        fontSize: 10,
                        color: Color(0xFFCBD5E1),
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Text(
                          'AI Wellness Score',
                          style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                          decoration: BoxDecoration(
                            color: AppColors.emerald,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            'LOW RISK',
                            style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w900),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'You\'re doing well today.\nKeep maintaining your sleep and hydration.',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        height: 1.35,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Subtitle Tagline
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                const Icon(Icons.verified_user_outlined, color: AppColors.accent, size: 14),
                const SizedBox(width: 6),
                const Expanded(
                  child: Text(
                    'Your Personal AI Welfare Companion for the Indian Armed Forces',
                    style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 9.5, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 2: TODAY'S AI SUMMARY
  // ---------------------------------------------------------------------------
  Widget _buildAiDailySummaryCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 8, offset: const Offset(0, 3)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'TODAY\'S AI SUMMARY',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.4),
              ),
              Text(
                'Updated 15m ago',
                style: TextStyle(fontSize: 10, color: AppColors.textMuted, fontWeight: FontWeight.w600),
              ),
            ],
          ),
          const SizedBox(height: 14),
          _buildSummaryBullet(Icons.bedtime, 'Sleep quality improved (+18% restorative REM)', AppColors.emerald),
          const SizedBox(height: 10),
          _buildSummaryBullet(Icons.trending_down, 'Stress reduced by 6% (cortisol baseline nominal)', AppColors.emerald),
          const SizedBox(height: 10),
          _buildSummaryBullet(Icons.shield, 'No burnout indicators detected across 4-day cycle', AppColors.primary),
          const SizedBox(height: 10),
          _buildSummaryBullet(Icons.water_drop, 'Hydration below target (1.4L of 2.0L logged)', AppColors.amber),
        ],
      ),
    );
  }

  Widget _buildSummaryBullet(IconData icon, String text, Color color) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: color, size: 16),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
          ),
        ),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 3 & SECTION 17: AI WELLNESS COACH & MOTIVATION
  // ---------------------------------------------------------------------------
  Widget _buildAiCoachCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E3A2F), AppColors.primary],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.accent.withValues(alpha: 0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(7),
                decoration: BoxDecoration(
                  color: AppColors.accent.withValues(alpha: 0.25),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.psychology_alt, color: AppColors.accent, size: 20),
              ),
              const SizedBox(width: 10),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'AI Coach',
                      style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w900),
                    ),
                    Text(
                      'Clinical Behavioral Recovery Engine',
                      style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 10),
                    ),
                  ],
                ),
              ),
              Row(
                children: [
                  TextButton.icon(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const SelfAssessmentScreen()),
                      );
                    },
                    icon: const Icon(Icons.assignment_outlined, size: 13, color: AppColors.accent),
                    label: const Text('Assess', style: TextStyle(color: AppColors.accent, fontSize: 11, fontWeight: FontWeight.w800)),
                  ),
                  TextButton.icon(
                    onPressed: _showAiChatModal,
                    icon: const Icon(Icons.chat_bubble_outline, size: 14, color: AppColors.accent),
                    label: const Text('Ask', style: TextStyle(color: AppColors.accent, fontSize: 11, fontWeight: FontWeight.w900)),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            '“Great progress this week! Try sleeping 30 minutes earlier tonight. A short evening walk in the barracks can further improve muscle recovery.”',
            style: TextStyle(color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.w600, height: 1.4),
          ),
        ],
      ),
    );
  }

  Widget _buildDailyMotivationCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.accentLight,
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.format_quote, color: AppColors.accent, size: 20),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'TODAY\'S MESSAGE',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.accent, letterSpacing: 0.5),
                ),
                SizedBox(height: 4),
                Text(
                  '"Strong soldiers take care of themselves before taking care of the nation."',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.textPrimary, fontStyle: FontStyle.italic),
                ),
                SizedBox(height: 3),
                Text(
                  '— Armed Forces Wellness Doctrine',
                  style: TextStyle(fontSize: 9.5, color: AppColors.textSecondary, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 10 & SECTION 19: TODAY'S PRIORITIES & CHALLENGES
  // ---------------------------------------------------------------------------
  Widget _buildPrioritiesAndChallengesCard() {
    final priorities = [
      {'title': 'Drink more water (Target: 2.0L)', 'icon': Icons.water_drop, 'color': Colors.blue},
      {'title': 'Complete 4-minute breathing drill', 'icon': Icons.air, 'color': AppColors.emerald},
      {'title': 'Sleep before 22:30 tonight', 'icon': Icons.bedtime, 'color': AppColors.secondary},
      {'title': 'Finish today\'s wellness check', 'icon': Icons.fact_check, 'color': AppColors.accent},
    ];

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'TODAY\'S PRIORITIES',
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.4),
          ),
          const SizedBox(height: 12),
          ...List.generate(priorities.length, (idx) {
            final p = priorities[idx];
            final isDone = _completedPriorities.contains(idx);
            return InkWell(
              onTap: () {
                setState(() {
                  if (isDone) {
                    _completedPriorities.remove(idx);
                  } else {
                    _completedPriorities.add(idx);
                  }
                });
              },
              borderRadius: BorderRadius.circular(10),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Row(
                  children: [
                    Icon(
                      isDone ? Icons.check_box : Icons.check_box_outline_blank,
                      color: isDone ? AppColors.emerald : AppColors.textMuted,
                      size: 20,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        p['title'] as String,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: isDone ? AppColors.textMuted : AppColors.textPrimary,
                          decoration: isDone ? TextDecoration.lineThrough : null,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
          const Divider(height: 24),

          // Section 19: Challenge Progress
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Today\'s Challenge: Drink 2 Litres of Water',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
              ),
              Text(
                '${_waterDrankLiters.toStringAsFixed(1)}L / ${_waterTargetLiters.toStringAsFixed(1)}L',
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.blue),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: (_waterDrankLiters / _waterTargetLiters).clamp(0.0, 1.0),
              minHeight: 10,
              backgroundColor: AppColors.background,
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.blue),
            ),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              OutlinedButton.icon(
                onPressed: () => _addWater(0.25),
                icon: const Icon(Icons.add, size: 14, color: Colors.blue),
                label: const Text('+250ml Water', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.blue)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.blue, width: 1.2),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE BOX BREATHING CARD (4-4-4-4)
  // ---------------------------------------------------------------------------
  Widget _buildInteractiveBoxBreathingCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'TACTICAL BOX BREATHING (4-4-4-4)',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.5),
              ),
              Text(
                'Cycles: $_completedBreathingCycles',
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.primary),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Center(
            child: Container(
              width: 120,
              height: 120,
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
                        fontSize: 26,
                        fontWeight: FontWeight.w900,
                        color: _breathingPhaseColors[_breathingPhaseIndex],
                      ),
                    ),
                    Text(
                      _isBreathingActive ? _breathingPhaseLabels[_breathingPhaseIndex] : 'PRANAYAMA',
                      style: TextStyle(
                        fontSize: 8.5,
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
          ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: _toggleBreathing,
            icon: Icon(_isBreathingActive ? Icons.pause : Icons.play_arrow, size: 16),
            label: Text(
              _isBreathingActive ? 'PAUSE BREATHING' : 'START 4-MIN BOX BREATHING',
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: _isBreathingActive ? AppColors.secondary : AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 5: WELLNESS JOURNEY CARD (68 -> 74 -> 84)
  // ---------------------------------------------------------------------------
  Widget _buildWellnessJourneyCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'WELLNESS JOURNEY PROGRESSION',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.5),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildJourneyStep('Last Month', '68', AppColors.amber, 'Moderate'),
              const Icon(Icons.arrow_forward_rounded, color: AppColors.textMuted, size: 20),
              _buildJourneyStep('This Month', '74', AppColors.primary, 'Improving'),
              const Icon(Icons.arrow_forward_rounded, color: AppColors.textMuted, size: 20),
              _buildJourneyStep('Today', '84', AppColors.emerald, 'Optimal'),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.emeraldLight,
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Row(
              children: [
                Icon(Icons.trending_up, color: AppColors.emerald, size: 16),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    '+16 points overall gain over 60 days. Consistent sleep schedule is the top contributing factor.',
                    style: TextStyle(fontSize: 10, color: AppColors.textPrimary, fontWeight: FontWeight.w700),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildJourneyStep(String label, String score, Color color, String badge) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary, fontWeight: FontWeight.w700)),
        const SizedBox(height: 4),
        Container(
          width: 54,
          height: 54,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.15),
            shape: BoxShape.circle,
            border: Border.all(color: color, width: 2),
          ),
          child: Center(
            child: Text(
              score,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: color),
            ),
          ),
        ),
        const SizedBox(height: 4),
        Text(badge, style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: color)),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 11 & SECTION 12: WEEKLY TREND & PERSONAL GROWTH
  // ---------------------------------------------------------------------------
  Widget _buildWeeklyTrendCard() {
    final weekScores = [
      {'day': 'Mon', 'score': 72},
      {'day': 'Tue', 'score': 74},
      {'day': 'Wed', 'score': 79},
      {'day': 'Thu', 'score': 82},
      {'day': 'Fri', 'score': 84},
    ];

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'WEEKLY WELLNESS TREND',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.5),
              ),
              Text(
                '+12 pts this week',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.emerald),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: weekScores.map((item) {
              final score = item['score'] as int;
              final double heightFactor = (score - 60) / 40.0;
              final bool isHighest = score == 84;
              return Column(
                children: [
                  Text(
                    score.toString(),
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      color: isHighest ? AppColors.emerald : AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    width: 32,
                    height: 80 * heightFactor,
                    decoration: BoxDecoration(
                      color: isHighest ? AppColors.emerald : AppColors.primaryLight,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: isHighest ? AppColors.emerald : AppColors.cardBorder,
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    item['day'] as String,
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
                  ),
                ],
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildPersonalGrowthCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'THIS MONTH PERSONAL GROWTH',
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.5),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildGrowthItem('Stress', '↓ 12%', AppColors.emerald, 'Reduced load'),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildGrowthItem('Sleep', '↑ 18%', AppColors.primary, 'Better REM'),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildGrowthItem('Energy', '↑ 21%', AppColors.accent, 'High vitality'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGrowthItem(String label, String change, Color color, String sub) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Column(
        children: [
          Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.textSecondary)),
          const SizedBox(height: 4),
          Text(change, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: color)),
          const SizedBox(height: 2),
          Text(sub, style: const TextStyle(fontSize: 8.5, color: AppColors.textMuted)),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 4: MOOD TIMELINE CARD
  // ---------------------------------------------------------------------------
  Widget _buildMoodTimelineCard() {
    final moods = [
      {'day': 'Mon', 'emoji': '😊', 'label': 'Good'},
      {'day': 'Tue', 'emoji': '🙂', 'label': 'Fair'},
      {'day': 'Wed', 'emoji': '😐', 'label': 'Neutral'},
      {'day': 'Thu', 'emoji': '😞', 'label': 'Tired'},
      {'day': 'Fri', 'emoji': '🙂', 'label': 'Fair'},
      {'day': 'Sat', 'emoji': '😀', 'label': 'Great'},
    ];

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'WEEKLY MOOD TIMELINE',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.5),
          ),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(moods.length, (idx) {
              final m = moods[idx];
              final isSelected = _selectedMoodIndex == idx;
              return InkWell(
                onTap: () => setState(() => _selectedMoodIndex = idx),
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.secondaryLight : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isSelected ? AppColors.secondary : Colors.transparent,
                      width: 1.5,
                    ),
                  ),
                  child: Column(
                    children: [
                      Text(m['day'] as String, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textSecondary)),
                      const SizedBox(height: 4),
                      Text(m['emoji'] as String, style: const TextStyle(fontSize: 22)),
                      const SizedBox(height: 4),
                      Text(m['label'] as String, style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w800, color: isSelected ? AppColors.secondary : AppColors.textMuted)),
                    ],
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 9 & SECTION 15: RISK BREAKDOWN & EXPLAINABLE AI
  // ---------------------------------------------------------------------------
  Widget _buildRiskBreakdownCard() {
    final factors = [
      {'name': 'Stress Level', 'pct': 18, 'status': 'Low Risk', 'color': AppColors.emerald},
      {'name': 'Sleep Quality', 'pct': 92, 'status': 'Optimal', 'color': AppColors.emerald},
      {'name': 'Fatigue Index', 'pct': 24, 'status': 'Low Risk', 'color': AppColors.emerald},
      {'name': 'Hydration Target', 'pct': 81, 'status': 'Needs Attention', 'color': AppColors.amber},
      {'name': 'Mental Wellness', 'pct': 89, 'status': 'Strong', 'color': AppColors.emerald},
    ];

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'RISK & HEALTH FACTOR BREAKDOWN',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.5),
          ),
          const SizedBox(height: 12),
          // Top 1% Principle #3: Stress Velocity & Momentum Indicator
          Container(
            padding: const EdgeInsets.all(12),
            margin: const EdgeInsets.only(bottom: 14),
            decoration: BoxDecoration(
              color: AppColors.emeraldLight,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.emerald.withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.emerald,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.trending_down, color: Colors.white, size: 20),
                ),
                const SizedBox(width: 10),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'STRESS VELOCITY: d(Stress)/dt',
                            style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: AppColors.emerald, letterSpacing: 0.5),
                          ),
                          Text(
                            '-1.2 pts/day',
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.emerald),
                          ),
                        ],
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Restorative baseline • Allostatic regulation stable',
                        style: TextStyle(fontSize: 10, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          ...factors.map((f) {
            final pct = f['pct'] as int;
            final color = f['color'] as Color;
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(f['name'] as String, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
                      Text('$pct% • ${f['status']}', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: color)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: pct / 100.0,
                      minHeight: 6,
                      backgroundColor: AppColors.background,
                      valueColor: AlwaysStoppedAnimation<Color>(color),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildExplainableAiCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.secondaryLight,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.secondary.withValues(alpha: 0.25)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.help_outline, color: AppColors.secondary, size: 16),
              SizedBox(width: 8),
              Text(
                'WHY? (AI Prediction Explanation)',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.4),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            '• Sleep quality decreased slightly on Wednesday due to late patrol duty.\n• Duty hours increased (+2.5h tactical field drill).\n• Hydration below normal (1.4L recorded vs 2.5L tactical recommendation).',
            style: TextStyle(fontSize: 11, height: 1.45, color: AppColors.textPrimary, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 8: MISSION READINESS GAUGE
  // ---------------------------------------------------------------------------
  Widget _buildMissionReadinessCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Row(
        children: [
          // Circular Dial
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 96,
                height: 96,
                child: CircularProgressIndicator(
                  value: 0.92,
                  strokeWidth: 10,
                  backgroundColor: AppColors.cardBorder,
                  valueColor: const AlwaysStoppedAnimation<Color>(AppColors.emerald),
                ),
              ),
              const Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('92%', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.secondary)),
                  Text('READINESS', style: TextStyle(fontSize: 7, fontWeight: FontWeight.w800, color: AppColors.textSecondary)),
                ],
              ),
            ],
          ),
          const SizedBox(width: 18),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'MISSION READY',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: AppColors.emerald, letterSpacing: 0.6),
                ),
                SizedBox(height: 4),
                Text(
                  'Optimal Combat & Tactical Fitness.',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                ),
                SizedBox(height: 4),
                Text(
                  'All psychological resilience thresholds and endurance vitals nominal for high-altitude deployment.',
                  style: TextStyle(fontSize: 9.5, color: AppColors.textSecondary, height: 1.3),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 20 & SECTION 23: SLEEP DASHBOARD & RECOVERY SCORE
  // ---------------------------------------------------------------------------
  Widget _buildSleepDashboardCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'SLEEP DASHBOARD',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.5),
              ),
              Text(
                '★★★★★ Excellent',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.accent),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Row(
            children: [
              Text(
                '7h 42m',
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
              ),
              SizedBox(width: 12),
              Text(
                'Taps: 22:15 • Reveille: 05:57',
                style: TextStyle(fontSize: 10, color: AppColors.textSecondary, fontWeight: FontWeight.w600),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Sleep Stage Bars
          Row(
            children: [
              Expanded(flex: 29, child: _buildSleepStagePill('Deep 2h 15m', AppColors.primary)),
              const SizedBox(width: 4),
              Expanded(flex: 23, child: _buildSleepStagePill('REM 1h 45m', AppColors.secondary)),
              const SizedBox(width: 4),
              Expanded(flex: 41, child: _buildSleepStagePill('Light 3h 12m', const Color(0xFF60A5FA))),
              const SizedBox(width: 4),
              Expanded(flex: 7, child: _buildSleepStagePill('30m', AppColors.cardBorder)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSleepStagePill(String label, Color color) {
    return Container(
      height: 22,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Center(
        child: Text(
          label,
          style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.w800),
          overflow: TextOverflow.ellipsis,
        ),
      ),
    );
  }

  Widget _buildRecoveryScoreCard() {
    return Container(
      padding: const EdgeInsets.all(16),
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
              color: AppColors.emeraldLight,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.bolt, color: AppColors.emerald, size: 24),
          ),
          const SizedBox(width: 14),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Recovery Score: 88% (Recovered)',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                ),
                SizedBox(height: 2),
                Text(
                  'Resting Heart Rate: 58 bpm • HRV Rest: 64 ms • Ready for drill.',
                  style: TextStyle(fontSize: 10, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 21 & SECTION 22: ACTIVITY & NUTRITION SUMMARY
  // ---------------------------------------------------------------------------
  Widget _buildActivityAndNutritionCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'ACTIVITY & NUTRITION DASHBOARD',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.5),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: _buildMetricTile(
                  icon: Icons.directions_walk,
                  title: 'Steps Today',
                  value: '8,432',
                  subtitle: 'Goal: 10,000 (84%)',
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildMetricTile(
                  icon: Icons.local_fire_department_outlined,
                  title: 'Calories',
                  value: '640 kcal',
                  subtitle: 'Tactical Drill: 1h 15m',
                  color: AppColors.accent,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: _buildMetricTile(
                  icon: Icons.restaurant_menu,
                  title: 'Meals Logged',
                  value: '2 of 3',
                  subtitle: 'Protein: 82% target',
                  color: AppColors.secondary,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildMetricTile(
                  icon: Icons.water_drop_outlined,
                  title: 'Water Intake',
                  value: '1.5 Litres',
                  subtitle: 'Target: 2.0 - 2.5L',
                  color: Colors.blue,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          InkWell(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const ScreenTimeScreen()),
              );
            },
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.primaryLight,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.cardBorder),
              ),
              child: const Row(
                children: [
                  Icon(Icons.phonelink_ring, color: AppColors.primary, size: 18),
                  SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Screen Time & Device Hygiene',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                        ),
                        Text(
                          '5h 22m today • 1h 35m nocturnal usage • Tap to inspect',
                          style: TextStyle(fontSize: 9.5, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  Icon(Icons.arrow_forward_ios, size: 12, color: AppColors.textSecondary),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricTile({
    required IconData icon,
    required String title,
    required String value,
    required String subtitle,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: color),
          const SizedBox(height: 6),
          Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
          Text(title, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textSecondary)),
          const SizedBox(height: 2),
          Text(subtitle, style: const TextStyle(fontSize: 8.5, color: AppColors.textMuted)),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 6 & SECTION 7: STREAKS & ACHIEVEMENT BADGES
  // ---------------------------------------------------------------------------
  Widget _buildStreaksAndBadgesCard() {
    final badges = [
      {'title': '7 Days Good Sleep', 'icon': Icons.bedtime, 'color': AppColors.primary},
      {'title': 'Hydration Goal', 'icon': Icons.water_drop, 'color': Colors.blue},
      {'title': 'Meditation 5 Days', 'icon': Icons.self_improvement, 'color': AppColors.emerald},
      {'title': 'Wellness Check', 'icon': Icons.verified, 'color': AppColors.accent},
    ];

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 21 Day Streak Banner
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFFFF7ED), Color(0xFFFED7AA)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFF97316).withValues(alpha: 0.3)),
            ),
            child: const Row(
              children: [
                Text('🔥', style: TextStyle(fontSize: 28)),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '21 DAY WELLNESS STREAK',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFFC2410C)),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Healthy Days Logged. 9 days to 30-Day Resilient Soldier badge!',
                        style: TextStyle(fontSize: 10, color: Color(0xFF9A3412), fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          const Text(
            'ACHIEVEMENT BADGES',
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.5),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: badges.map((b) {
              final color = b['color'] as Color;
              return Expanded(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: color.withValues(alpha: 0.25)),
                  ),
                  child: Column(
                    children: [
                      Icon(b['icon'] as IconData, size: 20, color: color),
                      const SizedBox(height: 4),
                      Text(
                        b['title'] as String,
                        style: const TextStyle(fontSize: 8.5, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 13: QUICK ACTIONS GRID
  // ---------------------------------------------------------------------------
  Widget _buildQuickActionsGrid() {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildActionCard(
                icon: Icons.assignment_turned_in,
                title: 'Start Wellness Check',
                desc: 'Detailed 6-factor check-in',
                color: AppColors.primary,
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const WellnessCheckinScreen()),
                  );
                },
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildActionCard(
                icon: Icons.support_agent,
                title: 'Talk to Welfare Officer',
                desc: 'Discreet connect (Priya Sharma)',
                color: AppColors.secondary,
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      backgroundColor: AppColors.secondary,
                      content: Text('Connecting to Welfare Officer Priya Sharma... Request logged.'),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: _buildActionCard(
                icon: Icons.psychology,
                title: 'Request Counselling',
                desc: '100% Confidential appointment',
                color: const Color(0xFF7C3AED),
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      backgroundColor: Color(0xFF7C3AED),
                      content: Text('Confidential psychological counselling appointment booked.'),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildActionCard(
                icon: Icons.emergency,
                title: 'Emergency Help',
                desc: 'Instant 24/7 Crisis Helpline',
                color: AppColors.rose,
                onTap: _triggerSos,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionCard({
    required IconData icon,
    required String title,
    required String desc,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(height: 10),
            Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
            const SizedBox(height: 2),
            Text(desc, style: const TextStyle(fontSize: 9.5, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // QUICK CHECK-IN SLIDERS & TELEMETRY SUBMISSION
  // ---------------------------------------------------------------------------
  Widget _buildQuickCheckinFormCard(SyncService sync) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'LOG DAILY TELEMETRY PULSE',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.4),
              ),
              Text(
                sync.isOnline ? 'LIVE GATEWAY' : 'OFFLINE QUEUE',
                style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: sync.isOnline ? AppColors.emerald : AppColors.amber),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Sleep Slider
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Sleep Duration', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
              Text('${_quickSleepHours.toStringAsFixed(1)} hrs',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.primary)),
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

          // Fatigue Slider
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Fatigue Level (1-10)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
              Text('Level $_quickFatigueLevel',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.secondary)),
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

          // Mood Slider
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Morale / Mood (1-10)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
              Text('$_quickMoodScore / 10',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.accent)),
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

          // Submit Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _isQuickSubmitting ? null : _submitQuickCheckin,
              icon: _isQuickSubmitting
                  ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                  : const Icon(Icons.send_rounded, size: 16),
              label: Text(
                _isQuickSubmitting ? 'TRANSMITTING...' : 'TRANSMIT TODAY\'S PULSE',
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
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 14: EMERGENCY SUPPORT
  // ---------------------------------------------------------------------------
  Widget _buildEmergencySupportCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.roseLight,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.rose.withValues(alpha: 0.35)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: AppColors.rose,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.emergency_outlined, color: Colors.white, size: 20),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'NEED IMMEDIATE HELP?',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: AppColors.rose, letterSpacing: 0.4),
                    ),
                    Text(
                      'One Tap Emergency Welfare Support',
                      style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'If you or a comrade are feeling overwhelmed, immediate 24x7 help is available with zero stigma. Defense Tele-MANAS Cell is ready to support you.',
            style: TextStyle(fontSize: 11, color: AppColors.textPrimary, height: 1.35),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _triggerSos,
              icon: const Icon(Icons.call, size: 16),
              label: const Text(
                'ONE TAP EMERGENCY SUPPORT',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.rose,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 18: ANONYMOUS WELFARE SUPPORT
  // ---------------------------------------------------------------------------
  Widget _buildAnonymousSupportCard() {
    return Container(
      padding: const EdgeInsets.all(16),
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
              color: AppColors.secondaryLight,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.lock_outline, color: AppColors.secondary, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Text('Need to Talk?', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
                    SizedBox(width: 6),
                    Text('• 100% Confidential', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.emerald)),
                  ],
                ),
                const SizedBox(height: 2),
                const Text(
                  'Private conversation with certified military counsellors. No duty logs created.',
                  style: TextStyle(fontSize: 9.5, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 16: WELLNESS CALENDAR (Dots Grid)
  // ---------------------------------------------------------------------------
  Widget _buildWellnessCalendarCard() {
    // 3 rows of 5 dots per plan.md (🟢🟢🟢🟡🟢 / 🟢🟢🟢🔴🟢 / 🟢🟢🟢🟢🟢)
    final grid = [
      ['🟢', '🟢', '🟢', '🟡', '🟢'],
      ['🟢', '🟢', '🟢', '🔴', '🟢'],
      ['🟢', '🟢', '🟢', '🟢', '🟢'],
    ];

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'MONTHLY WELLNESS CALENDAR',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.secondary, letterSpacing: 0.5),
              ),
              Text(
                'September 2026',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Column(
            children: grid.map((row) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: row.map((dot) {
                    Color dotColor;
                    if (dot == '🟢') {
                      dotColor = AppColors.emerald;
                    } else if (dot == '🟡') {
                      dotColor = AppColors.amber;
                    } else {
                      dotColor = AppColors.rose;
                    }
                    return Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: dotColor.withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                        border: Border.all(color: dotColor, width: 2),
                      ),
                      child: Center(
                        child: Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            color: dotColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildCalendarLegendDot(AppColors.emerald, 'Optimal (80+)'),
              const SizedBox(width: 14),
              _buildCalendarLegendDot(AppColors.amber, 'Moderate (60-79)'),
              const SizedBox(width: 14),
              _buildCalendarLegendDot(AppColors.rose, 'Needs Care (<60)'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCalendarLegendDot(Color color, String label) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(label, style: const TextStyle(fontSize: 9, color: AppColors.textSecondary, fontWeight: FontWeight.w700)),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // SECTION 25: DEFENSE TRUST ARCHITECTURE & CONFIDENTIALITY FIREWALL LEDGER
  // ---------------------------------------------------------------------------
  Widget _buildPrivacyCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.accent.withValues(alpha: 0.35)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: Emblem & Compliance Badge
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFF0E231B),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.accent.withValues(alpha: 0.5)),
                ),
                child: const Icon(Icons.security, color: AppColors.accent, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.emeraldLight,
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(color: AppColors.emerald.withValues(alpha: 0.4)),
                          ),
                          child: const Text(
                            'ARTICLE 42-A VERIFIED',
                            style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: AppColors.emerald),
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Text(
                          'SHA-256 LEDGER',
                          style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w800, color: AppColors.textMuted),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    const Text(
                      'Defense Confidentiality Firewall',
                      style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // 3-Tab Pill Switcher
          Container(
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.cardBorder),
            ),
            child: Row(
              children: [
                _buildTrustTabPill(0, 'Firewall Matrix', Icons.layers_outlined),
                _buildTrustTabPill(1, 'Audit Trail', Icons.history_edu),
                _buildTrustTabPill(2, 'Statute 42-A', Icons.gavel_outlined),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Tab Content
          if (_trustLedgerTab == 0) _buildFirewallMatrixTab(),
          if (_trustLedgerTab == 1) _buildAuditTrailTab(),
          if (_trustLedgerTab == 2) _buildStatuteTab(),

          const SizedBox(height: 14),
          // Footer Guarantee
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF0E231B),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.verified_user, color: AppColors.accent, size: 14),
                SizedBox(width: 6),
                Text(
                  'People First • Dignity Always • Zero Disciplinary Exposure',
                  style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w800, color: Colors.white),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrustTabPill(int index, String title, IconData icon) {
    final isSelected = _trustLedgerTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _trustLedgerTab = index;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 7),
          decoration: BoxDecoration(
            color: isSelected ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(9),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.06),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 13,
                color: isSelected ? AppColors.primary : AppColors.textSecondary,
              ),
              const SizedBox(width: 4),
              Text(
                title,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: isSelected ? FontWeight.w900 : FontWeight.w700,
                  color: isSelected ? AppColors.primary : AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFirewallMatrixTab() {
    return Column(
      children: [
        _buildTierRow(
          role: 'Soldier (You)',
          badgeText: '100% UNRESTRICTED',
          badgeColor: AppColors.emerald,
          badgeBg: AppColors.emeraldLight,
          description: 'Full visibility over your raw scores, voice check-ins, sleep telemetry, and private reflections.',
          icon: Icons.person_outline,
        ),
        const SizedBox(height: 8),
        _buildTierRow(
          role: 'Medical / Welfare Officer',
          badgeText: 'CLINICAL PRIVILEGE',
          badgeColor: AppColors.secondary,
          badgeBg: AppColors.secondaryLight,
          description: 'Access limited strictly to psychological triage & clinical care. Legally protected under doctor-patient privilege.',
          icon: Icons.medical_services_outlined,
        ),
        const SizedBox(height: 8),
        _buildTierRow(
          role: 'Formation Commander',
          badgeText: 'AGGREGATED ONLY (SEALED)',
          badgeColor: AppColors.accent,
          badgeBg: AppColors.accentLight,
          description: 'Commanders ONLY see unit-level readiness %. All psychiatric journals, personal feelings, and check-in texts are HARD-FIREWALLED and invisible.',
          icon: Icons.shield_outlined,
        ),
      ],
    );
  }

  Widget _buildTierRow({
    required String role,
    required String badgeText,
    required Color badgeColor,
    required Color badgeBg,
    required String description,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(icon, size: 15, color: AppColors.primary),
                  const SizedBox(width: 6),
                  Text(
                    role,
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: badgeBg,
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: badgeColor.withValues(alpha: 0.4)),
                ),
                child: Text(
                  badgeText,
                  style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: badgeColor),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            description,
            style: const TextStyle(fontSize: 10, color: AppColors.textSecondary, height: 1.35),
          ),
        ],
      ),
    );
  }

  Widget _buildAuditTrailTab() {
    final auditLogs = [
      {
        'officer': 'Soldier (Self-Audit)',
        'role': 'Owner Inspection',
        'scope': 'Full Self-Inspection Access',
        'hash': 'sha256:91b29a00...',
        'time': 'Just now',
        'color': AppColors.emerald,
      },
      {
        'officer': 'Major V. K. Nair',
        'role': 'Chief Medical Officer',
        'scope': 'Clinical Decompression Review',
        'hash': 'sha256:7f83b165...',
        'time': '14 mins ago',
        'color': AppColors.secondary,
      },
      {
        'officer': 'Col. R. S. Rathore',
        'role': 'Formation Commander',
        'scope': 'Aggregated Readiness % Only (Clinical Redacted)',
        'hash': 'sha256:d4e12c8a...',
        'time': '2 hours ago',
        'color': AppColors.accent,
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'IMMUTABLE CRYPTOGRAPHIC ACCESS LEDGER',
          style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: AppColors.textMuted, letterSpacing: 0.5),
        ),
        const SizedBox(height: 8),
        ...auditLogs.map((log) {
          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.cardBorder),
            ),
            child: Row(
              children: [
                Container(
                  width: 3,
                  height: 36,
                  decoration: BoxDecoration(
                    color: log['color'] as Color,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            log['officer'] as String,
                            style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                          ),
                          Text(
                            log['time'] as String,
                            style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.textMuted),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${log['role']} • ${log['scope']}',
                        style: const TextStyle(fontSize: 9.5, color: AppColors.textSecondary),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        log['hash'] as String,
                        style: const TextStyle(fontSize: 8.5, fontFamily: 'monospace', color: AppColors.textMuted),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }

  Widget _buildStatuteTab() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.emeraldLight,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.emerald.withValues(alpha: 0.35)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.shield_rounded, color: AppColors.emerald, size: 18),
              const SizedBox(width: 8),
              Text(
                'Defense Article 42-A Safe-Harbor',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.emerald.withValues(alpha: 0.9)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            'Under Article 42-A of the Armed Forces Welfare & Psychological Health Protocol:\n\n'
            '1. Absolute Non-Disciplinary Immunity: Self-reported stress and wellness evaluations can NEVER be used for ACR grading, court martial, disciplinary reprimand, or promotion denials.\n\n'
            '2. Cryptographic Tamper Seal: Every record is hashed using SHA-256 military standards.\n\n'
            '3. Direct Escalation: You have the right to request an independent review from the Armed Forces Medical Services Directorate at any time.',
            style: TextStyle(fontSize: 10, color: AppColors.textSecondary, height: 1.4),
          ),
        ],
      ),
    );
  }
}
