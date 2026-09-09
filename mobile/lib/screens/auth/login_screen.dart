import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/api_constants.dart';
import '../../core/services/auth_service.dart';
import '../../core/theme/app_theme.dart';
import '../main_navigation_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(text: 'soldier@forces.gov.in');
  final _passwordController = TextEditingController(text: 'soldier123');
  bool _obscurePassword = true;

  void _showGatewayConfigDialog() {
    final controller = TextEditingController(text: ApiConstants.activeHost);
    String? testResult;
    bool isTesting = false;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: AppColors.secondary,
          title: const Row(
            children: [
              Icon(Icons.dns, color: AppColors.accent, size: 20),
              SizedBox(width: 8),
              Text(
                'Backend Gateway Host',
                style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Enter Mac/Server LAN IP and port:',
                style: TextStyle(color: Color(0xFF8D99AE), fontSize: 12),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: controller,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'e.g. 10.56.52.238:8000',
                  hintStyle: const TextStyle(color: Color(0xFF475569)),
                  filled: true,
                  fillColor: const Color(0xFF0F2640),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.accent,
                      side: const BorderSide(color: AppColors.accent),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    ),
                    onPressed: isTesting
                        ? null
                        : () async {
                            setDialogState(() {
                              isTesting = true;
                              testResult = null;
                            });
                            final ok = await ApiConstants.testConnection(controller.text);
                            setDialogState(() {
                              isTesting = false;
                              testResult = ok
                                  ? 'Connected successfully! (HTTP 200 OK)'
                                  : 'Could not reach host. Verify IP & Wi-Fi.';
                            });
                          },
                    icon: isTesting
                        ? const SizedBox(
                            width: 12,
                            height: 12,
                            child: CircularProgressIndicator(strokeWidth: 1.5, color: AppColors.accent),
                          )
                        : const Icon(Icons.wifi_tethering, size: 14),
                    label: const Text('Test Connection', style: TextStyle(fontSize: 11)),
                  ),
                ],
              ),
              if (testResult != null) ...[
                const SizedBox(height: 8),
                Text(
                  testResult!,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: testResult!.contains('success') ? AppColors.emerald : AppColors.rose,
                  ),
                ),
              ],
            ],
          ),
          actions: [
            TextButton(
              onPressed: () async {
                await ApiConstants.setCustomHost('');
                setState(() {});
                if (ctx.mounted) Navigator.of(ctx).pop();
              },
              child: const Text('Reset Default', style: TextStyle(color: Color(0xFF8D99AE))),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
              onPressed: () async {
                await ApiConstants.setCustomHost(controller.text);
                setState(() {});
                if (ctx.mounted) Navigator.of(ctx).pop();
              },
              child: const Text('Save & Apply', style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }

  final List<Map<String, String>> _quickAccounts = [
    {
      'role': 'Soldier (Frontline)',
      'email': 'soldier@forces.gov.in',
      'password': 'soldier123',
      'name': 'Sepoy Amit Kumar',
      'desc': '10 Para Special Forces • Base Hierarchy',
    },
    {
      'role': 'Welfare Officer',
      'email': 'welfare@forces.gov.in',
      'password': 'welfare123',
      'name': 'Welfare Offr. Priya Sharma',
      'desc': 'Psychological Support Wing',
    },
    {
      'role': 'Formation Commander',
      'email': 'commander@forces.gov.in',
      'password': 'commander123',
      'name': 'Brig. Santosh Babu',
      'desc': '16 Corps Command Division',
    },
    {
      'role': 'HR / Admin Director',
      'email': 'hr@forces.gov.in',
      'password': 'hr123',
      'name': 'Col. Kabir Khan',
      'desc': 'Force Roster & Personnel Records',
    },
  ];

  Future<void> _handleLogin() async {
    final auth = Provider.of<AuthService>(context, listen: false);
    final success = await auth.login(
      _emailController.text,
      _passwordController.text,
    );

    if (success && mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
      );
    }
  }

  void _selectQuickAccount(Map<String, String> acc) {
    setState(() {
      _emailController.text = acc['email']!;
      _passwordController.text = acc['password']!;
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF0F2640), // Deep Military Navy
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Military Shield Header
                Center(
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.secondary,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0xFF234B75), width: 1.5),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.35),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.shield_outlined,
                      size: 44,
                      color: AppColors.accent, // Gold Accent
                    ),
                  ),
                ),
                const SizedBox(height: 18),

                // Title & Subtitle
                const Text(
                  'PSWMS MOBILE',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 1.2,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Personnel Stress & Welfare Monitoring System\nIntegrated Defense HRMS Gateway',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11,
                    color: Color(0xFF8D99AE),
                    fontWeight: FontWeight.w500,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 14),

                // Gateway Host Indicator & Config Button
                Center(
                  child: InkWell(
                    onTap: _showGatewayConfigDialog,
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F2640),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFF234B75)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 7,
                            height: 7,
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: AppColors.emerald,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'Gateway: ${ApiConstants.activeHost}',
                            style: const TextStyle(
                              color: AppColors.accent,
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(width: 6),
                          const Icon(Icons.edit_outlined, size: 12, color: Color(0xFF8D99AE)),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Error alert if any
                if (auth.errorMessage != null)
                  Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.rose.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.rose.withValues(alpha: 0.4)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline, color: AppColors.rose, size: 18),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            auth.errorMessage!,
                            style: const TextStyle(
                              color: AppColors.rose,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                // Card with Email & Password inputs
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.secondary,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFF234B75)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'DEFENSE CREDENTIALS',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 1.0,
                          color: AppColors.accent,
                        ),
                      ),
                      const SizedBox(height: 14),

                      // Email Field
                      TextField(
                        controller: _emailController,
                        style: const TextStyle(color: Colors.white, fontSize: 13),
                        decoration: InputDecoration(
                          hintText: 'Official Email (e.g. soldier@forces.gov.in)',
                          hintStyle: const TextStyle(color: Color(0xFF6C757D), fontSize: 12),
                          prefixIcon: const Icon(Icons.badge_outlined, color: AppColors.accent, size: 18),
                          filled: true,
                          fillColor: const Color(0xFF0F2640),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: const BorderSide(color: Color(0xFF234B75)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: const BorderSide(color: Color(0xFF234B75)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: const BorderSide(color: AppColors.accent),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Password Field
                      TextField(
                        controller: _passwordController,
                        obscureText: _obscurePassword,
                        style: const TextStyle(color: Colors.white, fontSize: 13),
                        decoration: InputDecoration(
                          hintText: 'Passcode / Security PIN',
                          hintStyle: const TextStyle(color: Color(0xFF6C757D), fontSize: 12),
                          prefixIcon: const Icon(Icons.lock_outline, color: AppColors.accent, size: 18),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword ? Icons.visibility_off : Icons.visibility,
                              color: const Color(0xFF8D99AE),
                              size: 18,
                            ),
                            onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                          ),
                          filled: true,
                          fillColor: const Color(0xFF0F2640),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: const BorderSide(color: Color(0xFF234B75)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: const BorderSide(color: Color(0xFF234B75)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: const BorderSide(color: AppColors.accent),
                          ),
                        ),
                      ),
                      const SizedBox(height: 18),

                      // Submit Button
                      SizedBox(
                        width: double.infinity,
                        height: 46,
                        child: ElevatedButton(
                          onPressed: auth.isLoading ? null : _handleLogin,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                            elevation: 4,
                          ),
                          child: auth.isLoading
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : const Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.login, size: 18),
                                    SizedBox(width: 8),
                                    Text(
                                      'AUTHENTICATE ACCESS',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: 0.8,
                                      ),
                                    ),
                                  ],
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Quick Demo Accounts Switcher
                const Text(
                  'QUICK ROLE SELECTOR (DEMO AUTH)',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.0,
                    color: Color(0xFF8D99AE),
                  ),
                ),
                const SizedBox(height: 8),

                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _quickAccounts.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 6),
                  itemBuilder: (context, idx) {
                    final acc = _quickAccounts[idx];
                    final isSelected = _emailController.text == acc['email'];

                    return InkWell(
                      onTap: () => _selectQuickAccount(acc),
                      borderRadius: BorderRadius.circular(14),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF234B75) : const Color(0xFF0F2640),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: isSelected ? AppColors.accent : const Color(0xFF1E3A58),
                            width: isSelected ? 1.5 : 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 14,
                              backgroundColor: isSelected ? AppColors.accent : AppColors.secondary,
                              child: Icon(
                                idx == 0
                                    ? Icons.person_outline
                                    : idx == 1
                                        ? Icons.favorite_outline
                                        : idx == 2
                                            ? Icons.security
                                            : Icons.manage_accounts,
                                size: 14,
                                color: isSelected ? AppColors.secondary : AppColors.accent,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    acc['role']!,
                                    style: TextStyle(
                                      color: isSelected ? AppColors.accent : Colors.white,
                                      fontSize: 11,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                  Text(
                                    '${acc['name']} • ${acc['desc']}',
                                    style: const TextStyle(
                                      color: Color(0xFF8D99AE),
                                      fontSize: 9,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (isSelected)
                              const Icon(
                                Icons.check_circle,
                                size: 16,
                                color: AppColors.accent,
                              ),
                          ],
                        ),
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
