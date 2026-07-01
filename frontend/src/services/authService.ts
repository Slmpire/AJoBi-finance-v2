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
    const response = await apiClient.post('/api/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    const raw = response.data as any;
    const d = raw.data || {};

    const normalized: LoginResponse = {
      status: raw.status,
      message: raw.message,
      data: {
        user_id: String(d.user_id || d.user?.id || d.id || ''),
        full_name: d.full_name || d.user?.full_name || '',
        token: d.token || '',
        email: d.email || d.user?.email || '',
        ajo_score: d.ajo_score || 0,
        score_tier: d.score_tier || 'Starter',
        onboarding_complete: d.onboarding_complete ?? false,
      },
    };

    if (normalized.data.token) {
      localStorage.setItem('token', normalized.data.token);
    }
    if (normalized.data.user_id) {
      localStorage.setItem('userId', normalized.data.user_id);
    }

    return normalized;
  },

  register: async (payload: RegistrationFormValues): Promise<RegisterResponse> => {
    const response = await apiClient.post('/api/auth/register', {
      full_name: payload.fullName,
      phone: payload.phoneNumber,
      email: payload.email,
      password: payload.password,
    });
    const raw = response.data as any;
    const d = raw.data || {};

    const normalized: RegisterResponse = {
      status: raw.status,
      message: raw.message,
      data: {
        user_id: String(d.user_id || d.user?.id || d.id || ''),
        full_name: d.user?.full_name || d.full_name || '',
        phone: d.user?.phone || d.phone || '',
        token: d.token || '',
        onboarding_complete: d.onboarding_complete ?? false,
      },
    };

    if (normalized.data.token) {
      localStorage.setItem('token', normalized.data.token);
    }

    return normalized;
  },

  getCurrentUser: async (): Promise<{ status: boolean; message: string; data: UserData }> => {
    const response = await apiClient.get('/api/auth/user');
    const raw = response.data as any;
    const d = raw.data || {};

    return {
      status: raw.status,
      message: raw.message,
      data: {
        user_id: String(d.id || d.user_id || ''),
        full_name: d.full_name || '',
        phone: d.phone || '',
        email: d.email || '',
        language: d.language || 'english',
        profile_photo: d.profile_photo || '',
        onboarding_complete: d.onboarding_complete ?? false,
      },
    };
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      try {
        await apiClient.post('/api/auth/logout');
      } catch (e) {
        console.error('Logout failed on server', e);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      localStorage.removeItem('onboardingComplete');
    }
  },
};