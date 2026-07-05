import { apiClient } from './apiClient';

export interface KYCData {
  user_id: string | number;
  beneficiary_account: string;
  bvn: string;
  account_name: string;
}

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get('/api/user/profile');
    return response.data;
  },
  submitKYC: async (payload: {
  bvn: string;
  account_number: string;
  account_name: string;
  bank_code: string;
}) => {
  const response = await apiClient.post('/api/user/kyc', payload);
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

  // Legacy stubs — kept so existing components don't break
  updateKYC: async (data: KYCData) => {
    const response = await apiClient.patch('/api/user/beneficiary', {
      account_number: data.beneficiary_account,
      account_name: data.account_name,
      bank_code: '000',
    });
    return { success: response.data.status ? 'true' : 'false', message: response.data.message };
  },

  createVirtualAccount: async (_userId: string | number) => {
    return { status: 'pending', data: null };
  },
  getVirtualAccountData: async () => {
  const response = await apiClient.get('/api/user/virtualaccounts');
  return response.data;
},

};