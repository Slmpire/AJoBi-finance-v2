import { apiClient } from './apiClient';

export interface UserProfile {
  full_name: string;
  phone: string;
  email: string;
  photo_url?: string;
}

export interface SecuritySettings {
  biometric_enabled: boolean;
  transaction_pin_set: boolean;
}

export interface NotificationSettings {
  push_notifications: boolean;
  sms_alerts: boolean;
}

export const settingsService = {
  getProfile: async () => {
    const response = await apiClient.get('/api/settings/profile');
    return response.data;
  },

  updateProfile: async (payload: Partial<UserProfile>) => {
    const response = await apiClient.put('/api/settings/profile', payload);
    return response.data;
  },

  getSecuritySettings: async () => {
    const response = await apiClient.get('/api/settings/security');
    return response.data;
  },

  updateSecuritySettings: async (payload: Partial<SecuritySettings>) => {
    const response = await apiClient.put('/api/settings/security', payload);
    return response.data;
  },

  getNotificationSettings: async () => {
    const response = await apiClient.get('/api/settings/notifications');
    return response.data;
  },

  updateNotificationSettings: async (payload: Partial<NotificationSettings>) => {
    const response = await apiClient.put('/api/settings/notifications', payload);
    return response.data;
  }
};
