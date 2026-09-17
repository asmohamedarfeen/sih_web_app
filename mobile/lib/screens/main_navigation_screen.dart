import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/services/auth_service.dart';
import '../../core/services/localization_service.dart';
import '../../core/widgets/language_selector_sheet.dart';
import '../../core/theme/app_theme.dart';
import 'soldier/soldier_dashboard_screen.dart';
import 'soldier/wellness_checkin_screen.dart';
import 'soldier/soldier_dossier_screen.dart';
import 'welfare/welfare_dashboard_screen.dart';
import 'commander/commander_dashboard_screen.dart';
import 'admin/admin_dashboard_screen.dart';
import 'auth/login_screen.dart';
import 'soldier/duty_readiness_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  Widget _getPrimaryRoleDashboard(AuthService auth) {
    final user = auth.currentUser;
    if (user == null) return const SoldierDashboardScreen();

    if (user.isWelfareOfficer) {
      return const WelfareDashboardScreen();
    } else if (user.isCommander) {
      return const CommanderDashboardScreen();
    } else if (user.isAdmin) {
      return const AdminDashboardScreen();
    } else {
      return const SoldierDashboardScreen();
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);
    final loc = Provider.of<LocalizationService>(context);
    final user = auth.currentUser;

    final List<Widget> pages = [
      _getPrimaryRoleDashboard(auth),
      const WellnessCheckinScreen(),
      const DutyReadinessScreen(),
      const SoldierDossierScreen(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.shield_outlined, color: AppColors.accent, size: 22),
            const SizedBox(width: 8),
            Text(
              user?.role == 'SOLDIER'
                  ? loc.t('app_title', 'SOLDIER PULSE')
                  : user?.role == 'WELFARE_OFFICER'
                      ? 'WELFARE HUB'
                      : user?.role == 'COMMANDER'
                          ? 'COMMAND RADAR'
                          : 'HR FORCE DIRECTORY',
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 0.5, color: Colors.white),
            ),
          ],
        ),
        actions: [
          // Regional Language Toggle Button
          IconButton(
            tooltip: loc.t('language_select', 'Regional Language'),
            icon: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(loc.currentLanguageModel.flag, style: const TextStyle(fontSize: 15)),
                const SizedBox(width: 4),
                const Icon(Icons.language, size: 18),
              ],
            ),
            onPressed: () => LanguageSelectorSheet.show(context),
          ),
          IconButton(
            tooltip: 'Logout',
            icon: const Icon(Icons.logout, size: 20),
            onPressed: () async {
              final nav = Navigator.of(context);
              await auth.logout();
              nav.pushReplacement(
                MaterialPageRoute(builder: (_) => const LoginScreen()),
              );
            },
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: pages,
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: AppColors.cardBorder, width: 1)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (idx) => setState(() => _currentIndex = idx),
          type: BottomNavigationBarType.fixed,
          selectedItemColor: AppColors.primary,
          unselectedItemColor: AppColors.textSecondary,
          selectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800),
          unselectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.w500),
          items: [
            BottomNavigationBarItem(
              icon: const Icon(Icons.dashboard_outlined),
              activeIcon: const Icon(Icons.dashboard),
              label: loc.t('dashboard', 'Dashboard'),
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.monitor_heart_outlined),
              activeIcon: const Icon(Icons.monitor_heart),
              label: loc.t('checkin', 'Check-in'),
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.schedule_outlined),
              activeIcon: const Icon(Icons.schedule),
              label: loc.t('duty_readiness', 'Duty & Readiness'),
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.person_outline),
              activeIcon: const Icon(Icons.person),
              label: loc.t('dossier', 'Dossier'),
            ),
          ],
        ),
      ),
    );
  }
}
