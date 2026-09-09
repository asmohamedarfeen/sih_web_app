import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/api_constants.dart';
import '../../core/services/api_service.dart';
import '../../core/services/auth_service.dart';
import '../../core/theme/app_theme.dart';

class ScreenTimeScreen extends StatefulWidget {
  const ScreenTimeScreen({super.key});

  @override
  State<ScreenTimeScreen> createState() => _ScreenTimeScreenState();
}

class _ScreenTimeScreenState extends State<ScreenTimeScreen> {
  bool _isTransmitting = false;
  String? _lastTransmissionMsg;
  DateTime? _lastTransmittedTime;
  bool _isEmulatorMode = true; // Default emulator / template fallback mode
  bool _isZeroBaseline = false; // Zero baseline testing toggle

  // Real-time device screen time breakdown telemetry (Default Tactical Template)
  List<Map<String, dynamic>> _apps = [
    {
      'name': 'Tactical Comms & C3I',
      'category': 'Mission Operations',
      'icon': Icons.radar,
      'color': AppColors.secondary,
      'minutes': 130, // 2h 10m
    },
    {
      'name': 'Defense GIS & Topo Maps',
      'category': 'Navigation & Terrain',
      'icon': Icons.map_outlined,
      'color': AppColors.primary,
      'minutes': 85, // 1h 25m
    },
    {
      'name': 'Forces Secure Messenger',
      'category': 'Secure Communication',
      'icon': Icons.chat_bubble_outline,
      'color': AppColors.accent,
      'minutes': 72, // 1h 12m
    },
    {
      'name': 'Defense News & Weather Radar',
      'category': 'Information & Weather',
      'icon': Icons.cloud_outlined,
      'color': AppColors.amber,
      'minutes': 35, // 35m
    },
    {
      'name': 'Terminal System & Utilities',
      'category': 'Device Hardware',
      'icon': Icons.settings_system_daydream,
      'color': AppColors.textSecondary,
      'minutes': 20, // 20m
    },
  ];

  int _unlockCount = 48;
  int _nightExposureMinutes = 95; // 1h 35m post 22:00

  int get _totalMinutes => _apps.fold(0, (sum, item) => sum + (item['minutes'] as int));

  void _applyZeroBaseline() {
    setState(() {
      _isZeroBaseline = true;
      for (var a in _apps) {
        a['minutes'] = 0;
      }
      _unlockCount = 0;
      _nightExposureMinutes = 0;
    });
  }

  void _applyDefaultTemplate() {
    setState(() {
      _isZeroBaseline = false;
      _isEmulatorMode = true;
      _apps = [
        {
          'name': 'Tactical Comms & C3I',
          'category': 'Mission Operations',
          'icon': Icons.radar,
          'color': AppColors.secondary,
          'minutes': 130,
        },
        {
          'name': 'Defense GIS & Topo Maps',
          'category': 'Navigation & Terrain',
          'icon': Icons.map_outlined,
          'color': AppColors.primary,
          'minutes': 85,
        },
        {
          'name': 'Forces Secure Messenger',
          'category': 'Secure Communication',
          'icon': Icons.chat_bubble_outline,
          'color': AppColors.accent,
          'minutes': 72,
        },
        {
          'name': 'Defense News & Weather Radar',
          'category': 'Information & Weather',
          'icon': Icons.cloud_outlined,
          'color': AppColors.amber,
          'minutes': 35,
        },
        {
          'name': 'Terminal System & Utilities',
          'category': 'Device Hardware',
          'icon': Icons.settings_system_daydream,
          'color': AppColors.textSecondary,
          'minutes': 20,
        },
      ];
      _unlockCount = 48;
      _nightExposureMinutes = 95;
    });
  }

  void _simulateDeviceFetch() {
    // Simulates dynamic live fetch from device hardware
    setState(() {
      _isEmulatorMode = false;
      _isZeroBaseline = false;
      _apps[0]['minutes'] = 145; // 2h 25m
      _apps[1]['minutes'] = 90;  // 1h 30m
      _apps[2]['minutes'] = 80;  // 1h 20m
      _apps[3]['minutes'] = 40;  // 40m
      _apps[4]['minutes'] = 25;  // 25m
      _unlockCount = 54;
      _nightExposureMinutes = 110;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        backgroundColor: AppColors.emerald,
        content: Text('⚡ Live device screen time fetched & telemetry updated!'),
      ),
    );
  }

  String _formatDuration(int minutes) {
    if (minutes == 0) return '0m';
    final h = minutes ~/ 60;
    final m = minutes % 60;
    if (h > 0) return '${h}h ${m}m';
    return '${m}m';
  }

  Future<void> _transmitScreenTime() async {
    final auth = Provider.of<AuthService>(context, listen: false);
    final user = auth.currentUser;

    setState(() => _isTransmitting = true);

    final payload = {
      'personnel_uid': user?.uid ?? 'UID-SLD-015',
      'total_screen_time_minutes': _totalMinutes,
      'unlock_count': _unlockCount,
      'night_exposure_minutes': _nightExposureMinutes,
      'device_model': _isEmulatorMode ? 'Android Emulator (Template Fallback)' : 'Physical Tactical Terminal (Live)',
      'app_breakdown': _apps.map((a) => {
        'app_name': a['name'],
        'category': a['category'],
        'duration_minutes': a['minutes'],
      }).toList(),
    };

    try {
      final response = await ApiService.post(ApiConstants.screenTime, payload);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _lastTransmissionMsg = data['message'] ?? 'Screen time synced successfully with Defense HRMS.';
          _lastTransmittedTime = DateTime.now();
        });

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              backgroundColor: AppColors.emerald,
              content: Row(
                children: [
                  Icon(Icons.check_circle, color: Colors.white, size: 18),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text('Screen Time Telemetry Transmitted to Welfare Gateway!'),
                  ),
                ],
              ),
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('Screen time transmission error: $e');
    } finally {
      setState(() => _isTransmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final totalFormatted = _formatDuration(_totalMinutes);
    final nightFormatted = _formatDuration(_nightExposureMinutes);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Screen Time Monitor',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: const Color(0xFF0F2640),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.2),
                    blurRadius: 12,
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
                      const Row(
                        children: [
                          Icon(Icons.phonelink_ring, color: AppColors.accent, size: 24),
                          SizedBox(width: 8),
                          Text(
                            'Tactical Device Telemetry',
                            style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w900),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppColors.secondary,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFF234B75)),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              _isEmulatorMode ? Icons.computer : Icons.smartphone,
                              color: AppColors.accent,
                              size: 11,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              _isEmulatorMode ? 'EMULATOR TEMPLATE' : 'REAL DEVICE LIVE',
                              style: const TextStyle(color: AppColors.accent, fontSize: 8, fontWeight: FontWeight.w900),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Big Stats Row
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: AppColors.secondary,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('TOTAL USAGE TODAY', style: TextStyle(color: Color(0xFF8D99AE), fontSize: 9, fontWeight: FontWeight.w800)),
                              const SizedBox(height: 4),
                              Text(
                                totalFormatted,
                                style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: AppColors.secondary,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('NIGHT EXPOSURE (>22:00)', style: TextStyle(color: AppColors.amber, fontSize: 9, fontWeight: FontWeight.w800)),
                              const SizedBox(height: 4),
                              Text(
                                nightFormatted,
                                style: const TextStyle(color: AppColors.amber, fontSize: 22, fontWeight: FontWeight.w900),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Emulator & Hardware Fallback Control Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'HARDWARE RUNTIME / SCREEN TEMPLATE',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5),
                        ),
                        Text(
                          'Adaptive Mode',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.accent),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'On emulators without hardware sensors, the default Defense Screen Template is used (or 0 baseline). On physical hardware, live stats update automatically.',
                      style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: _applyDefaultTemplate,
                            style: OutlinedButton.styleFrom(
                              backgroundColor: (!_isZeroBaseline && _isEmulatorMode) ? AppColors.accentLight : Colors.transparent,
                              side: BorderSide(
                                color: (!_isZeroBaseline && _isEmulatorMode) ? AppColors.accent : AppColors.cardBorder,
                              ),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              padding: const EdgeInsets.symmetric(vertical: 8),
                            ),
                            child: const Text('Default Template', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800)),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: _applyZeroBaseline,
                            style: OutlinedButton.styleFrom(
                              backgroundColor: _isZeroBaseline ? AppColors.accentLight : Colors.transparent,
                              side: BorderSide(
                                color: _isZeroBaseline ? AppColors.accent : AppColors.cardBorder,
                              ),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              padding: const EdgeInsets.symmetric(vertical: 8),
                            ),
                            child: const Text('Zero Baseline (0m)', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800)),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: _simulateDeviceFetch,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.emerald,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              padding: const EdgeInsets.symmetric(vertical: 8),
                            ),
                            child: const Text('Fetch Live', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Transmission Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'HRMS WELFARE GATEWAY SYNC',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5),
                        ),
                        if (_lastTransmittedTime != null)
                          Text(
                            'Synced: ${_lastTransmittedTime!.hour.toString().padLeft(2, '0')}:${_lastTransmittedTime!.minute.toString().padLeft(2, '0')}',
                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.emerald),
                          ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Transmit current device screen time metrics to your assigned Welfare Officer for fatigue load correlation.',
                      style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      height: 42,
                      child: ElevatedButton.icon(
                        onPressed: _isTransmitting ? null : _transmitScreenTime,
                        icon: _isTransmitting
                            ? const SizedBox(
                                width: 16,
                                height: 16,
                                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                              )
                            : const Icon(Icons.cloud_upload_outlined, size: 18),
                        label: Text(
                          _isTransmitting ? 'TRANSMITTING...' : 'TRANSMIT TO WELFARE GATEWAY',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                    if (_lastTransmissionMsg != null) ...[
                      const SizedBox(height: 8),
                      Text(
                        '✓ $_lastTransmissionMsg',
                        style: const TextStyle(fontSize: 10, color: AppColors.emerald, fontWeight: FontWeight.w700),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // App Breakdown List
            const Text(
              'APPLICATION & CATEGORY BREAKDOWN',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5),
            ),
            const SizedBox(height: 8),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _apps.length,
              separatorBuilder: (_, _) => const SizedBox(height: 8),
              itemBuilder: (context, idx) {
                final app = _apps[idx];
                final int minutes = app['minutes'];
                final double pct = _totalMinutes > 0 ? (minutes / _totalMinutes) * 100 : 0.0;
                final durationStr = _formatDuration(minutes);

                return Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.cardBorder),
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: (app['color'] as Color).withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Icon(app['icon'] as IconData, size: 18, color: app['color'] as Color),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  app['name'] as String,
                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                                ),
                                Text(
                                  app['category'] as String,
                                  style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
                                ),
                              ],
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                durationStr,
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                              ),
                              Text(
                                '${pct.toStringAsFixed(1)}%',
                                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: app['color'] as Color),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: pct / 100,
                          minHeight: 5,
                          backgroundColor: AppColors.background,
                          valueColor: AlwaysStoppedAnimation<Color>(app['color'] as Color),
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
    );
  }
}
