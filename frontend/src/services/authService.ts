import { apiClient } from './apiClient';
import { TokenResponse, User, DemoAccount } from '../types/auth';

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/authentication/login', credentials);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/authentication/me');
    return response.data;
  },

  async getDemoAccounts(): Promise<DemoAccount[]> {
    const response = await apiClient.get<DemoAccount[]>('/authentication/demo-accounts');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/authentication/logout');
    } catch {
      // Ignore network errors on logout
    }
  },
};
