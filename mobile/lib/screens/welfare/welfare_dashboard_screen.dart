import 'dart:convert';
import 'package:flutter/material.dart';
import '../../core/constants/api_constants.dart';
import '../../core/services/api_service.dart';
import '../../core/theme/app_theme.dart';
import '../../models/intervention_model.dart';

class WelfareDashboardScreen extends StatefulWidget {
  const WelfareDashboardScreen({super.key});

  @override
  State<WelfareDashboardScreen> createState() => _WelfareDashboardScreenState();
}

class _WelfareDashboardScreenState extends State<WelfareDashboardScreen> {
  List<InterventionModel> _cases = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchCases();
  }

  Future<void> _fetchCases() async {
    setState(() => _isLoading = true);
    try {
      final response = await ApiService.get(ApiConstants.interventions);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        _cases = data.map((e) => InterventionModel.fromJson(e)).toList();
      }
    } catch (e) {
      debugPrint('Error loading interventions: $e');
    }
    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Clinical Welfare Hub', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchCases,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchCases,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Welfare Summary Header
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: const Color(0xFF064E3B), // Deep Emerald
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.volunteer_activism, color: Color(0xFF6EE7B7), size: 24),
                            SizedBox(width: 8),
                            Text(
                              'Psychological Welfare Wing',
                              style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w900),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${_cases.length} active clinical cases and compassionate grant workflows underway.',
                          style: const TextStyle(color: Color(0xFFA7F3D0), fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Cases List
                  const Text(
                    'ACTIVE WELFARE & COUNSELING CASES',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5),
                  ),
                  const SizedBox(height: 8),

                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _cases.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 10),
                    itemBuilder: (context, idx) {
                      final c = _cases[idx];
                      return Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: AppColors.cardBorder),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: AppColors.accentLight,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    c.caseNumber,
                                    style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: AppColors.accent),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: c.urgency == 'CRITICAL' ? AppColors.roseLight : AppColors.amberLight,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    c.urgency,
                                    style: TextStyle(
                                      fontSize: 8,
                                      fontWeight: FontWeight.w900,
                                      color: c.urgency == 'CRITICAL' ? AppColors.rose : AppColors.amber,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              c.title,
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${c.personnelName} (${c.rank}) • ${c.personnelUid}',
                              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'Action: ${c.actionPlan}',
                              style: const TextStyle(fontSize: 11, color: AppColors.textPrimary),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Venue: ${c.venue}', style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
                                Text('Grant: ₹${c.approvedAmount.toStringAsFixed(0)}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.emerald)),
                              ],
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
