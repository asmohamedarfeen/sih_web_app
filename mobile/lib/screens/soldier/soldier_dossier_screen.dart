import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/services/auth_service.dart';
import '../../core/services/localization_service.dart';
import '../../core/theme/app_theme.dart';

class SoldierDossierScreen extends StatelessWidget {
  const SoldierDossierScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthService>(context).currentUser;
    final loc = Provider.of<LocalizationService>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          loc.t('dossier', 'Personnel Service Dossier'),
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Identity Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 30,
                      backgroundColor: AppColors.secondary,
                      child: Text(
                        (user?.fullName.isNotEmpty == true) ? user!.fullName[0] : 'S',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: AppColors.accent,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user?.fullName ?? 'Sepoy Amit Kumar',
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${user?.rank ?? 'Sepoy / Commando'} • ${user?.branch ?? 'Indian Army'}',
                            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.accentLight,
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: AppColors.accent.withValues(alpha: 0.3)),
                            ),
                            child: Text(
                              '${user?.uid ?? 'UID-SLD-015'} | ${user?.regimentalNumber ?? 'ARMY-2021-9988'}',
                              style: const TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w900,
                                color: AppColors.accent,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),

            // Operational Parameters Grid
            const Text(
              'BIOMETRIC & READINESS PARAMETERS',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5),
            ),
            const SizedBox(height: 8),

            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 1.6,
              children: [
                _buildInfoTile('Medical Category', 'SHAPE-1 (S1H1A1P1E1)', Icons.health_and_safety, AppColors.emerald),
                _buildInfoTile('Unit Deployment', user?.unit ?? '10 Para SF', Icons.military_tech, AppColors.primary),
                _buildInfoTile('Duty Shift Status', 'Active Frontline Patrol', Icons.radar, AppColors.accent),
                _buildInfoTile('Assigned Counselor', 'Welfare Offr. Priya Sharma', Icons.support_agent, AppColors.secondary),
              ],
            ),
            const SizedBox(height: 16),

            // Upcoming Shifts Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Active Operational Shifts', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800)),
                        Text('Verified HRMS Roster', style: TextStyle(fontSize: 10, color: AppColors.emerald, fontWeight: FontWeight.w700)),
                      ],
                    ),
                    const Divider(height: 20),
                    _buildRosterRow('Tomorrow 0400 - 1200', 'Forward Sector Alpha Recon', 'Nominal Duty'),
                    const SizedBox(height: 8),
                    _buildRosterRow('Saturday 1800 - 0200', 'Night Perimeter Vigil', 'High Tempo Shift'),
                    const SizedBox(height: 8),
                    _buildRosterRow('Monday 0900 - 1000', 'Mandatory Psychological Debrief', 'Welfare Session'),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoTile(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, size: 14, color: color),
              const SizedBox(width: 4),
              Text(label, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.textSecondary)),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            value,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
          ),
        ],
      ),
    );
  }

  Widget _buildRosterRow(String time, String title, String badge) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(8)),
          child: const Icon(Icons.schedule, size: 14, color: AppColors.textSecondary),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800)),
              Text(time, style: const TextStyle(fontSize: 9, color: AppColors.textSecondary)),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
          decoration: BoxDecoration(
            color: AppColors.accentLight,
            borderRadius: BorderRadius.circular(6),
          ),
          child: Text(badge, style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w800, color: AppColors.accent)),
        ),
      ],
    );
  }
}
