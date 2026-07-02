import { apiClient } from './apiClient';

export interface ScoreBreakdownItem {
  score: number;
  weight: number;
  label: string;
  explanation: string;
}

export interface LockedFeature {
  feature: string;
  required_score: number;
  current_score: number;
  unlocked: boolean;
  points_needed?: number;
}

export interface AjoScoreData {
  score: number;
  tier: string;
  tier_color: string;
  next_tier: string;
  points_to_next_tier: number;
  breakdown: {
    savings_consistency: ScoreBreakdownItem;
    repayment_behaviour: ScoreBreakdownItem;
    escrow_completion: ScoreBreakdownItem;
    transaction_history: ScoreBreakdownItem;
    account_maturity: ScoreBreakdownItem;
    community_standing: ScoreBreakdownItem;
  };
  unlocked_features: string[];
  locked_features: LockedFeature[];
  improvement_tips: string[];
}

export interface ScoreHistoryItem {
  date: string;
  score: number;
}

export interface ScoreEvent {
  event_id: string;
  event_type: string;
  points: number;
  direction: 'up' | 'down';
  reason: string;
  created_at: string;
}

export interface EligibilityData {
  loan_eligible: boolean;
  loan_conditions: {
    score_met: { required: number; current: number; passed: boolean };
    tenure_met: { required_days: number; current_days: number; passed: boolean; days_remaining: number };
    ajo_member: { passed: boolean };
    consistency_met: { required_percent: number; current_percent: number; passed: boolean };
    no_disputes: { passed: boolean };
    no_default: { passed: boolean };
  };
  loan_eligibility_message: string;
  group_tiers_available: string[];
  escrow_eligible: boolean;
  instalment_eligible: boolean;
  insurance_eligible: boolean;
}

export const scoreService = {
  getAjoScore: async () => {
    const response = await apiClient.get('/api/ajoscore/me');
    return response.data;
  },

  uploadBankStatement: async (formData: FormData) => {
    const response = await apiClient.post('/api/ajoscore/bank-statement', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getScoreHistory: async (days: 30 | 60 | 90 = 30) => {
    const response = await apiClient.get('/api/score/history', { params: { days } });
    return response.data;
  },

  getScoreEvents: async (limit: number = 20, offset: number = 0) => {
    const response = await apiClient.get('/api/score/events', { params: { limit, offset } });
    return response.data;
  },

  getEligibility: async () => {
    const response = await apiClient.get('/api/score/eligibility');
    return response.data;
  },
};