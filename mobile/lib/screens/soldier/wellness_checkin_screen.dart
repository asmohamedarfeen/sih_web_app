import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/services/auth_service.dart';
import '../../core/services/sync_service.dart';
import '../../core/services/localization_service.dart';
import '../../core/theme/app_theme.dart';
import '../../models/wellness_model.dart';

class WellnessCheckinScreen extends StatefulWidget {
  const WellnessCheckinScreen({super.key});

  @override
  State<WellnessCheckinScreen> createState() => _WellnessCheckinScreenState();
}

class _WellnessCheckinScreenState extends State<WellnessCheckinScreen> {
  double _sleepHours = 6.5;
  int _fatigueLevel = 5;
  int _moodScore = 7;
  int _workloadPressure = 6;
  int _physicalStrain = 5;
  int _consecutiveDutyDays = 4;
  final _notesController = TextEditingController();
  bool _isSubmitting = false;

  double _estimatedStress() {
    double stress = 50.0;
    stress += (8.0 - _sleepHours) * 5.0;
    stress += (_fatigueLevel - 5) * 4.0;
    stress += (_workloadPressure - 5) * 3.5;
    stress += (_physicalStrain - 5) * 3.0;
    stress -= (_moodScore - 5) * 4.0;
    stress += (_consecutiveDutyDays - 3) * 3.0;
    return stress.clamp(5.0, 98.0);
  }

  Future<void> _handleSubmit() async {
    final auth = Provider.of<AuthService>(context, listen: false);
    final sync = Provider.of<SyncService>(context, listen: false);

    setState(() => _isSubmitting = true);

    final item = WellnessAssessmentModel(
      personnelUid: auth.currentUser?.uid ?? 'UID-SLD-015',
      personnelName: auth.currentUser?.fullName ?? 'Sepoy Amit Kumar',
      sleepHours: _sleepHours,
      fatigueLevel: _fatigueLevel,
      moodScore: _moodScore,
      workloadPressure: _workloadPressure,
      physicalStrain: _physicalStrain,
      consecutiveDutyDays: _consecutiveDutyDays,
      notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
    );

    final res = await sync.submitCheckin(item);

    setState(() => _isSubmitting = false);

    if (mounted) {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Check-in Logged'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                res['offline'] == true
                    ? 'Saved to Local Queue (Offline). Will auto-sync when connected.'
                    : 'Transmitted securely to the Defense Server.',
                style: const TextStyle(fontSize: 13),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: _estimatedStress() > 70 ? AppColors.roseLight : AppColors.emeraldLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    Icon(
                      _estimatedStress() > 70 ? Icons.warning : Icons.check_circle,
                      color: _estimatedStress() > 70 ? AppColors.rose : AppColors.emerald,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Stress Index: ${_estimatedStress().toStringAsFixed(0)}%',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        color: _estimatedStress() > 70 ? AppColors.rose : AppColors.emerald,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(ctx).pop();
                Navigator.of(context).pop();
              },
              child: const Text('Return to Dashboard', style: TextStyle(fontWeight: FontWeight.w800)),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = Provider.of<LocalizationService>(context);
    final estimated = _estimatedStress();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          loc.t('checkin', 'Daily Telemetry Check-in'),
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: estimated > 70 ? AppColors.roseLight : AppColors.emeraldLight,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: estimated > 70 ? AppColors.rose : AppColors.emerald,
                width: 1,
              ),
            ),
            child: Text(
              'Stress: ${estimated.toStringAsFixed(0)}%',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w900,
                color: estimated > 70 ? AppColors.rose : AppColors.emerald,
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header Info Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Row(
                children: [
                  Icon(Icons.monitor_heart, color: AppColors.accent, size: 28),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Frontline Daily Pulse',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Logs are cryptographically signed & saved locally if offline.',
                          style: TextStyle(color: Color(0xFF8D99AE), fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Sliders Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Sleep Duration
                    _buildSlider(
                      title: 'Sleep Duration',
                      valueText: '${_sleepHours.toStringAsFixed(1)} Hours',
                      icon: Icons.nightlight_round,
                      value: _sleepHours,
                      min: 2.0,
                      max: 12.0,
                      divisions: 20,
                      onChanged: (v) => setState(() => _sleepHours = v),
                    ),
                    const Divider(height: 24),

                    // Fatigue Level
                    _buildSlider(
                      title: 'Fatigue & Exhaustion',
                      valueText: '$_fatigueLevel / 10',
                      icon: Icons.battery_alert,
                      value: _fatigueLevel.toDouble(),
                      min: 1,
                      max: 10,
                      divisions: 9,
                      activeColor: _fatigueLevel > 7 ? AppColors.rose : AppColors.accent,
                      onChanged: (v) => setState(() => _fatigueLevel = v.round()),
                    ),
                    const Divider(height: 24),

                    // Mood Score
                    _buildSlider(
                      title: 'Mood & Morale',
                      valueText: '$_moodScore / 10',
                      icon: Icons.sentiment_satisfied_alt,
                      value: _moodScore.toDouble(),
                      min: 1,
                      max: 10,
                      divisions: 9,
                      activeColor: _moodScore < 4 ? AppColors.rose : AppColors.emerald,
                      onChanged: (v) => setState(() => _moodScore = v.round()),
                    ),
                    // Physical Strain
                    _buildSlider(
                      title: 'Physical Strain & Exertion',
                      valueText: '$_physicalStrain / 10',
                      icon: Icons.directions_run,
                      value: _physicalStrain.toDouble(),
                      min: 1,
                      max: 10,
                      divisions: 9,
                      onChanged: (v) => setState(() => _physicalStrain = v.round()),
                    ),
                    const Divider(height: 24),

                    // Workload Pressure
                    _buildSlider(
                      title: 'Operational Workload Strain',
                      valueText: '$_workloadPressure / 10',
                      icon: Icons.fitness_center,
                      value: _workloadPressure.toDouble(),
                      min: 1,
                      max: 10,
                      divisions: 9,
                      onChanged: (v) => setState(() => _workloadPressure = v.round()),
                    ),
                    const Divider(height: 24),

                    // Consecutive Duty Days
                    _buildSlider(
                      title: 'Consecutive Duty Days',
                      valueText: '$_consecutiveDutyDays Days',
                      icon: Icons.calendar_today,
                      value: _consecutiveDutyDays.toDouble(),
                      min: 1,
                      max: 21,
                      divisions: 20,
                      onChanged: (v) => setState(() => _consecutiveDutyDays = v.round()),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Optional Notes
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'OPTIONAL NOTES / PATROL REMARKS',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textSecondary,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _notesController,
                      maxLines: 2,
                      style: const TextStyle(fontSize: 13),
                      decoration: InputDecoration(
                        hintText: 'e.g. Night patrol mountain ridge, mild headache',
                        hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                        filled: true,
                        fillColor: AppColors.background,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppColors.cardBorder),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppColors.cardBorder),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Submit Button
            SizedBox(
              height: 50,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _handleSubmit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 2,
                ),
                child: _isSubmitting
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.send, size: 18),
                          SizedBox(width: 8),
                          Text(
                            'TRANSMIT TELEMETRY',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ],
                      ),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildSlider({
    required String title,
    required String valueText,
    required IconData icon,
    required double value,
    required double min,
    required double max,
    required int divisions,
    required ValueChanged<double> onChanged,
    Color? activeColor,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Icon(icon, size: 16, color: AppColors.textSecondary),
                const SizedBox(width: 6),
                Text(
                  title,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                ),
              ],
            ),
            Text(
              valueText,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                color: activeColor ?? AppColors.accent,
              ),
            ),
          ],
        ),
        Slider(
          value: value,
          min: min,
          max: max,
          divisions: divisions,
          activeColor: activeColor ?? AppColors.accent,
          onChanged: onChanged,
        ),
      ],
    );
  }
}
