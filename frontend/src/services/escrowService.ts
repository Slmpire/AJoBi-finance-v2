import { apiClient } from './apiClient';

export interface CreateEscrowPayload {
  creator_id: string | number;
  type: string;
  counterparty_id: string | number;
  amount: number;
  description: string;
  expected_completion_date?: string;
  listing_id?: string | number;
}

export interface EscrowResponse {
  status: boolean;
  message: string;
  data: {
    escrow_id: string | number;
    payment_reference: string;
    squad_payment_link: string;
    type: string;
    amount: number;
    trust_score: number;
    trust_verdict: string;
    trust_reason: string;
  };
}

export interface EscrowVirtualAccountResponse {
  status: boolean | "success";
  message: string;
  data: any;
}

export interface EscrowDisbursementResponse {
  status: boolean;
  message: string;
  url: string;
}

export const escrowService = {
  createEscrow: async (payload: CreateEscrowPayload): Promise<EscrowResponse> => {
    const response = await apiClient.post<EscrowResponse>('/api/escrow/create', payload);
    return response.data;
  },

  getUserEscrows: async (userId: string | number, params?: { type?: string; status?: string }) => {
    const response = await apiClient.get(`/api/escrow/mine`, { params });
    return response.data;
  },

  getEscrowDetail: async (escrowId: string | number) => {
    const response = await apiClient.get(`/api/escrow/${escrowId}`);
    return response.data;
  },

  generateVirtualAccount: async (escrowId: string | number): Promise<EscrowVirtualAccountResponse> => {
    const response = await apiClient.post(`/api/escrow/${escrowId}/virtual-account`);
    return response.data;
  },

  getPublicEscrow: async (code: string) => {
    const response = await apiClient.get(`/api/escrow/public/${code}`);
    return response.data;
  },

  confirmEscrow: async (escrowId: string | number): Promise<EscrowDisbursementResponse> => {
    const response = await apiClient.post(`/api/escrow/${escrowId}/confirm`);
    return response.data;
  }
};
