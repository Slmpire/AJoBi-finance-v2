import { apiClient } from './apiClient';

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get('/api/user/profile');
    return response.data;
  },

  updateProfile: async (payload: {
    full_name?: string;
    phone?: string;
    language?: string;
    profile_photo?: string;
  }) => {
    const response = await apiClient.patch('/api/user/profile', payload);
    return response.data;
  },

  updateBeneficiary: async (payload: {
    account_number: string;
    account_name: string;
    bank_code: string;
  }) => {
    const response = await apiClient.patch('/api/user/beneficiary', payload);
    return response.data;
  },

  getDashboardSummary: async () => {
    const response = await apiClient.get('/api/user/dashboard');
    return response.data;
  },
};