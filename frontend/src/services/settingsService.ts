import { apiClient } from './apiClient';

export const settingsService = {
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
  getNotifications: async () => {
  const response = await apiClient.get('/api/settings/notifications');
  return response.data;
},

updateNotifications: async (payload: any) => {
  const response = await apiClient.put('/api/settings/notifications', payload);
  return response.data;
},
};