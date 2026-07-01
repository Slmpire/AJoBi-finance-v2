import { apiClient } from './apiClient';

export interface SetupProgressResponse {
  status: boolean;
  data: {
    steps_completed: number[];
    current_step: number;
    onboarding_complete: boolean;
  };
}

export interface SetupStepResponse {
  status: boolean;
  data: {
    step_completed: number;
    next_step: number;
  };
}

export interface SetupFinalResponse {
  status: boolean;
  data: {
    onboarding_complete: boolean;
    ajo_score: number;
    score_tier: string;
    breakdown: {
      savings_consistency: number;
      repayment_behaviour: number;
      escrow_completion: number;
      transaction_history: number;
      account_maturity: number;
      community_standing: number;
    };
    explanation: string;
    improvement_tips: string[];
  };
}

export const setupService = {
  getProgress: async (): Promise<SetupProgressResponse> => {
    const response = await apiClient.get('/api/setup/progress');
    return response.data;
  },

  submitStep1: async (data: { occupation: string }): Promise<SetupStepResponse> => {
    const response = await apiClient.post('/api/setup/step1', data);
    return response.data;
  },

  submitStep2: async (data: {
    trade_duration: string;
    state: string;
    lga: string;
    income_range: string;
  }): Promise<SetupStepResponse> => {
    const response = await apiClient.post('/api/setup/step2', data);
    return response.data;
  },

  submitStep3: async (data: {
    saves_money: boolean;
    savings_methods: string[];
    in_ajo_group: boolean;
    contribution_consistency: string;
  }): Promise<SetupStepResponse> => {
    const response = await apiClient.post('/api/setup/step3', data);
    return response.data;
  },

  submitStep4: async (data: {
    has_borrowed: boolean;
    repaid_fully: boolean;
    repaid_on_time: boolean;
  }): Promise<SetupStepResponse> => {
    const response = await apiClient.post('/api/setup/step4', data);
    return response.data;
  },

  submitStep5: async (data: {
    language: string;
    profile_photo?: string | null;
  }): Promise<SetupFinalResponse> => {
    const response = await apiClient.post('/api/setup/step5', data);
    return response.data;
  },
};