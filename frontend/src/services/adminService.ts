import { apiClient } from './apiClient';

export const adminService = {
  getTransactions: async (params?: { page?: number; type?: string; date?: string }) => {
    const response = await apiClient.get('/api/admin/transactions', { params });
    return response.data;
  },

  getDisputedEscrows: async () => {
    const response = await apiClient.get('/api/admin/escrow/disputed');
    return response.data;
  },

  releaseEscrow: async (escrowId: string | number) => {
    const response = await apiClient.post(`/api/admin/escrow/${escrowId}/release`);
    return response.data;
  },

  refundEscrow: async (escrowId: string | number) => {
    const response = await apiClient.post(`/api/admin/escrow/${escrowId}/refund`);
    return response.data;
  },

  getUsers: async (params?: { page?: number }) => {
    const response = await apiClient.get('/api/admin/users', { params });
    return response.data;
  },

  banUser: async (userId: string | number) => {
    const response = await apiClient.post(`/api/admin/users/${userId}/ban`);
    return response.data;
  }
};
