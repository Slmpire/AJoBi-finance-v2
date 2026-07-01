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
  getProgress: async (_email?: string): Promise<SetupProgressResponse> => {
    const response = await apiClient.get('/api/setup/progress');
    return response.data;
  },

  submitStep1: async (data: {
    occupation: string;
    email?: string;
  }): Promise<SetupStepResponse> => {
    const response = await apiClient.post('/api/setup/step1', {
      occupation: data.occupation,
    });
    return response.data;
  },

  submitStep2: async (data: {
    trade_duration: string;
    state: string;
    lga: string;
    income_range: string;
    email?: string;
  }): Promise<SetupStepResponse> => {
    const response = await apiClient.post('/api/setup/step2', {
      trade_duration: data.trade_duration,
      state: data.state,
      lga: data.lga,
      income_range: data.income_range,
    });
    return response.data;
  },

  submitStep3: async (data: {
    saves_money: boolean;
    savings_methods: string[];
    in_ajo_group: boolean;
    contribution_consistency: string;
    email?: string;
  }): Promise<SetupStepResponse> => {
    const consistencyMap: Record<string, string> = {
      'Always on time': 'always_on_time',
      'Mostly on time': 'mostly_on_time',
      'Sometimes late': 'sometimes_late',
      'Often late': 'often_late',
    };
    const response = await apiClient.post('/api/setup/step3', {
      saves_money: data.saves_money,
      savings_methods: data.savings_methods,
      in_ajo_group: data.in_ajo_group,
      contribution_consistency: consistencyMap[data.contribution_consistency] || data.contribution_consistency,
    });
    return response.data;
  },

  submitStep4: async (data: {
    has_borrowed: boolean;
    repaid_fully: boolean;
    repaid_on_time: boolean;
    email?: string;
  }): Promise<SetupStepResponse> => {
    const response = await apiClient.post('/api/setup/step4', {
      has_borrowed: data.has_borrowed,
      repaid_fully: data.repaid_fully,
      repaid_on_time: data.repaid_on_time,
    });
    return response.data;
  },

  submitStep5: async (data: {
    language: string;
    profile_photo?: string | null;
    email?: string;
  }): Promise<SetupFinalResponse> => {
    const response = await apiClient.post('/api/setup/step5', {
      language: data.language,
      profile_photo: data.profile_photo || null,
    });
    return response.data;
  },
};