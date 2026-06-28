import { apiClient } from './apiClient';
import { LoginFormValues } from '@/models/auth/useLoginForm';
import { RegistrationFormValues } from '@/models/auth/useRegistrationForm';

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string;
  };
  token?: string;
}

export interface UserData {
  user_id: string;
  full_name: string;
  phone?: string;
  email?: string;
  occupation?: string;
  state?: string;
  lga?: string;
  language?: string;
  token?: string;
  ajo_score?: number;
  score_tier?: string;
  profile_photo?: string;
  onboarding_complete: boolean;
  member_since?: string;
  squad_wallet_balance?: number;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    user_id: string;
    full_name: string;
    token: string;
    email: string;
    ajo_score: number;
    score_tier: string;
    onboarding_complete: boolean | string;
  };
}

export interface RegisterResponse {
  status: boolean;
  message: string;
  data: {
    user_id: string;
    full_name: string;
    phone: string;
    token: string;
    onboarding_complete: boolean | string;
  };
}

export const authService = {
  login: async (credentials: any): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    const data = response.data as any;
    if (data.status === true || data.success === true) {
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
      }
      if (data.data?.user_id) {
        localStorage.setItem('userId', data.data.user_id);
      }
    }
    return data;
  },

  register: async (payload: RegistrationFormValues): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/api/auth/register', payload);
    const data = response.data as any;
    if ((data.status === true || data.success === true) && data.data?.token) {
      localStorage.setItem('token', data.data.token);
    }
    return data;
  },

  getCurrentUser: async (): Promise<{ status: boolean; message: string; data: UserData }> => {
    const response = await apiClient.get('/api/auth/user');
    return response.data;
  },
  
  logout: async () => {
    if (typeof window !== 'undefined') {
      try {
        await apiClient.post('/api/auth/logout');
      } catch (e) {
        console.error("Logout failed on server", e);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  }
};
