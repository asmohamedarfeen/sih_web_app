import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Strategic Defense Color Palette
  static const Color primary = Color(0xFF2F4F3E); // Military Green
  static const Color primaryLight = Color(0xFFEAF0EC);
  static const Color secondary = Color(0xFF163A5F); // Navy Blue
  static const Color secondaryLight = Color(0xFFE8EEF5);
  static const Color accent = Color(0xFFD4A017); // Gold
  static const Color accentLight = Color(0xFFFAF5E7);
  
  // Tactical Status Accents
  static const Color emerald = Color(0xFF16A34A); // Success Green
  static const Color emeraldLight = Color(0xFFDCFCE7);
  static const Color amber = Color(0xFFF59E0B); // Warning Amber
  static const Color amberLight = Color(0xFFFEF3C7);
  static const Color rose = Color(0xFFDC2626); // Danger Red
  static const Color roseLight = Color(0xFFFEE2E2);
  
  // Neutral Surfaces
  static const Color background = Color(0xFFF8FAFC); // Off White
  static const Color surface = Colors.white; // White Cards
  static const Color cardBorder = Color(0xFFE2E8F0); // Subtle Border
  static const Color textPrimary = Color(0xFF1F2937); // Dark Gray
  static const Color textSecondary = Color(0xFF4B5563); // Gray 600
  static const Color textMuted = Color(0xFF9CA3AF); // Gray 400
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        primary: AppColors.primary,
        secondary: AppColors.secondary,
        surface: AppColors.surface,
      ),
      textTheme: GoogleFonts.interTextTheme().copyWith(
        displayLarge: GoogleFonts.inter(
          fontSize: 28,
          fontWeight: FontWeight.w900,
          color: AppColors.textPrimary,
          letterSpacing: -0.5,
        ),
        headlineMedium: GoogleFonts.inter(
          fontSize: 20,
          fontWeight: FontWeight.w800,
          color: AppColors.textPrimary,
          letterSpacing: -0.3,
        ),
        titleLarge: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: AppColors.textPrimary,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: AppColors.textSecondary,
        ),
        labelSmall: GoogleFonts.jetBrainsMono(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.secondary,
        elevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: AppColors.accent),
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontSize: 15,
          fontWeight: FontWeight.w800,
        ),
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppColors.cardBorder, width: 1),
        ),
      ),
    );
  }
}
