import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';
import 'api_service.dart';
import '../../models/user_model.dart';

class AuthService extends ChangeNotifier {
  UserModel? _currentUser;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _currentUser != null;
  String? get errorMessage => _errorMessage;

  static const String _userCacheKey = 'pswms_cached_user';

  AuthService() {
    _loadCachedUser();
  }

  Future<void> _loadCachedUser() async {
    final prefs = await SharedPreferences.getInstance();
    final cached = prefs.getString(_userCacheKey);
    if (cached != null) {
      try {
        _currentUser = UserModel.fromJson(jsonDecode(cached));
        notifyListeners();
      } catch (e) {
        debugPrint('Error parsing cached user: $e');
      }
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiService.post(
        ApiConstants.login,
        {'email': email.trim(), 'password': password.trim()},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['access_token'];
        final userJson = data['user'];

        await ApiService.setToken(token);
        _currentUser = UserModel.fromJson(userJson);

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_userCacheKey, jsonEncode(userJson));

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        final err = jsonDecode(response.body);
        _errorMessage = err['detail'] ?? 'Invalid credentials';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = 'Network connection failed. Verify host and backend status.';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await ApiService.post(ApiConstants.logout, {});
    } catch (_) {}

    await ApiService.clearToken();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userCacheKey);
    _currentUser = null;
    notifyListeners();
  }
}
