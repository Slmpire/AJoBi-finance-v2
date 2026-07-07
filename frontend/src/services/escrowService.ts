import { apiClient } from './apiClient';

export interface CreateEscrowPayload {
  creator_id: string;
  type: string;
  counterparty_id: string;
  amount: number;
  description: string;
  expected_completion_date: string;
  listing_id?: string;

  recipient_email?: string;
  recipient_phone?: string;
}

export const escrowService = {
  createEscrow: async (payload: CreateEscrowPayload) => {
    const response = await apiClient.post('/api/escrow/create', payload);
    return response.data;
  },

  getMyEscrows: async () => {
    const response = await apiClient.get('/api/escrow/mine');
    return response.data;
  },

  getEscrowDetail: async (escrowId: string | number) => {
    const response = await apiClient.get(`/api/escrow/${escrowId}`);
    return response.data;
  },

  getPublicEscrow: async (code: string) => {
    const response = await apiClient.get(`/api/escrow/public/${code}`);
    return response.data;
  },

  confirmEscrow: async (escrowId: string | number) => {
    const response = await apiClient.post(`/api/escrow/${escrowId}/confirm`);
    return response.data;
  },

  getUserEscrows: async (_userId: any, _params?: any) => {
  const response = await apiClient.get('/api/escrow/mine');
  return response.data;
},
generateVirtualAccount: async (escrowId: string | number) => {
  const response = await apiClient.post(`/api/escrow/${escrowId}/virtual-account`);
  return response.data;
},
};