import { apiClient } from './apiClient';

export interface KYCData {
  user_id: string | number;
  beneficiary_account: string;
  bvn: string;
  account_name: string;
}

export interface KYCResponse {
  success: string;
  message: string;
}

export interface VirtualAccountResponse {
  status: string;
  data: any;
}

export const userService = {
  updateKYC: async (data: KYCData): Promise<KYCResponse> => {
    const response = await apiClient.post<KYCResponse>('/api/user/kyc', data);
    return response.data;
  },

  createVirtualAccount: async (userId: string | number): Promise<VirtualAccountResponse> => {
    const response = await apiClient.post<VirtualAccountResponse>('/api/user/virtualaccounts', { user_id: userId });
    return response.data;
  }
};
