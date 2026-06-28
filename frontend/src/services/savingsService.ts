import { apiClient } from './apiClient';

export interface SavingsGoal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  category: string;
  percentage_achieved: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  status: 'active' | 'inactive';
}

export interface SavingsActivity {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: 'deposit' | 'interest' | 'bonus';
}

export const savingsService = {
  getOverview: async () => {
    const response = await apiClient.get('/api/savings/overview');
    return response.data;
  },

  getGoals: async () => {
    const response = await apiClient.get('/api/savings/mine');
    return response.data;
  },

  getAutomationRules: async () => {
    const response = await apiClient.get('/api/savings/automation-rules');
    return response.data;
  },

  getActivity: async () => {
    const response = await apiClient.get('/api/savings/activity');
    return response.data;
  },

  createGoal: async (payload: { name: string; target_amount: number; deadline: string; frequency: string }) => {
    const response = await apiClient.post('/api/savings/create', payload);
    return response.data;
  },

  getGoalDetail: async (id: string) => {
    const response = await apiClient.get(`/api/savings/${id}`);
    return response.data;
  },

  breakGoal: async (id: string) => {
    const response = await apiClient.post(`/api/savings/${id}/break`);
    return response.data;
  },

  setupDebit: async (id: string) => {
    const response = await apiClient.post(`/api/savings/${id}/setup-debit`);
    return response.data;
  }
};
