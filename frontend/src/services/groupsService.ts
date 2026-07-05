import { apiClient } from './apiClient';

export interface CreateGroupPayload {
  name: string;
  contribution_amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  max_members: number;
}

export interface JoinGroupPayload {
  invite_code: string;
}

export interface SetupDebitPayload {
  account_number: string;
  bank_code: string;
}


export const groupsService = {
  createGroup: async (payload: CreateGroupPayload) => {
    const response = await apiClient.post('/api/groups/create', payload);
    return response.data;
  },

  getMyGroups: async () => {
    const response = await apiClient.get('/api/groups/mine');
    return response.data;
  },

  getGroupDetail: async (groupId: string) => {
    const response = await apiClient.get(`/api/groups/${groupId}`);
    return response.data;
  },

  getGroupMembers: async (groupId: string) => {
    const response = await apiClient.get(`/api/groups/${groupId}/members`);
    return response.data;
  },

  getGroupPayments: async (groupId: string) => {
    const response = await apiClient.get(`/api/groups/${groupId}/payments`);
    return response.data;
  },

  joinGroup: async (payload: JoinGroupPayload) => {
    const response = await apiClient.post('/api/groups/join', payload);
    return response.data;
  },

  setupDebit: async (groupId: string) => {
    const response = await apiClient.post(`/api/groups/${groupId}/setup-debit`);
    return response.data;
  },

  getGroupContributionHistory: async (groupId: string) => {
    const response = await apiClient.get(`/api/groups/${groupId}/payments`);
    return response.data;
  },

  initiateGroupPayment: async (_userId: any, groupId: string) => {
    const response = await apiClient.post(`/api/groups/${groupId}/setup-debit`);
    return response.data;
  },

  getBankCodes: async () => {
    const response = await apiClient.get('/api/groups/banks');
    return response.data;
  },
  autoMatchGroup: async (payload: { contribution_amount: number; frequency?: string }) => {
    const response = await apiClient.post('/api/groups/match', {
      contribution_amount: payload.contribution_amount,
      frequency: payload.frequency || 'monthly',
    });
    return response.data;
  },
};