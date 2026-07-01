import axios from 'axios';

// The base URL should point to your Laravel backend (e.g. http://localhost:8000)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    // 'Content-Type': 'application/json',
    // 'Accept': 'application/json'
  }
});

// Add a request interceptor to attach the Bearer token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

// Add a response interceptor to standardize error throwing
apiClient.interceptors.response.use(
  (response) => {
    // Some backend endpoints return HTTP 200 but indicate an error in the payload
    if (response.data && (response.data.status === false || response.data.success === false || response.data.success === "false")) {
      const message = response.data.error?.message || response.data.message || 'An error occurred';
      return Promise.reject(new ApiError(200, message, response.data));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      const message = data?.message || error.message || 'An error occurred';
      return Promise.reject(new ApiError(status, message, data));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new ApiError(0, 'No response from server. Please check your network connection.', null));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new ApiError(0, error.message, null));
    }
  }
);

// Mock API Interceptor
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

if (USE_MOCK_API) {
  apiClient.interceptors.request.use((config) => {
    config.adapter = async (config) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let data: any = { status: true, message: 'Success', data: {} };
          const url = config.url || '';
          const method = config.method?.toLowerCase();
          
          try {
            // --- Feature 1: Auth & AjoScore ---
            if (url.includes('/api/auth/register') && method === 'post') {
              data = { status: true, message: 'Registration successful', data: { token: 'mock-token', user_id: '1' } };
            } else if (url.includes('/api/auth/login') && method === 'post') {
              data = { status: true, message: 'Login successful', data: { token: 'mock-token', user_id: '1', role: 'user' } };
            } else if (url.includes('/api/auth/logout') && method === 'post') {
              data = { status: true, message: 'Logged out successfully', data: null };
            } else if (url.includes('/api/auth/user') && method === 'get') {
              data = { status: true, message: 'User fetched', data: { id: '1', name: 'John Doe', phone: '08012345678', email: 'john@example.com' } };
            } else if (url.includes('/api/ajoscore/onboarding') && method === 'post') {
              data = { status: true, message: 'Onboarding complete', data: { score: 35, breakdown: {} } };
            } else if (url.includes('/api/ajoscore/bank-statement') && method === 'post') {
              data = { status: true, message: 'Statement analysed', data: { score: 75, breakdown: {} } };
            } else if (url.includes('/api/ajoscore/me') && method === 'get') {
              data = { status: true, message: 'Score fetched', data: { score: 75, history: [], breakdown: {} } };
            }

            // --- Feature 2: Ajo Groups ---
            else if (url.includes('/api/groups/create') && method === 'post') {
              data = { status: true, message: 'Group created', data: { id: '101', invite_code: 'AJO123', link: 'ajobi.app/join/AJO123' } };
            } else if (url.includes('/api/groups/join') && method === 'post') {
              data = { status: true, message: 'Joined successfully', data: { id: '101', position: 2 } };
            } else if (url.includes('/api/groups/mine') && method === 'get') {
              data = { status: true, message: 'Groups fetched', data: [{ id: '101', name: 'Office Ajo', contribution_amount: 10000, next_due_date: '2026-07-01', rotation_position: 2 }] };
            } else if (url.match(/\/api\/groups\/\d+$/) && method === 'get') {
              data = { status: true, message: 'Group details fetched', data: { id: '101', name: 'Office Ajo', current_cycle: 1, max_members: 5 } };
            } else if (url.match(/\/api\/groups\/\d+\/members/) && method === 'get') {
              data = { status: true, message: 'Members fetched', data: [{ id: '1', name: 'John Doe', has_paid: true }] };
            } else if (url.match(/\/api\/groups\/\d+\/payments/) && method === 'get') {
              data = { status: true, message: 'Payments fetched', data: [] };
            } else if (url.match(/\/api\/groups\/\d+\/setup-debit/) && method === 'post') {
              data = { status: true, message: 'Setup initialized', data: { authorization_url: 'https://paystack.com/auth/mock' } };
            }

            // --- Feature 3: Savings Goals ---
            else if (url.includes('/api/savings/create') && method === 'post') {
              data = { status: true, message: 'Goal created', data: { id: '201', instalment_amount: 5000 } };
            } else if (url.includes('/api/savings/mine') && method === 'get') {
              data = { status: true, message: 'Goals fetched', data: [{ id: '201', name: 'Rent', target_amount: 500000, locked_balance: 100000, next_debit_date: '2026-07-01' }] };
            } else if (url.match(/\/api\/savings\/\d+$/) && method === 'get') {
              data = { status: true, message: 'Goal details fetched', data: { id: '201', name: 'Rent', progress: 20, history: [] } };
            } else if (url.match(/\/api\/savings\/\d+\/break/) && method === 'post') {
              data = { status: true, message: 'Goal broken', data: { locked_balance: 100000 } };
            } else if (url.match(/\/api\/savings\/\d+\/setup-debit/) && method === 'post') {
              data = { status: true, message: 'Setup initialized', data: { authorization_url: 'https://paystack.com/auth/mock' } };
            }

            // --- Feature 4: Escrow ---
            else if (url.includes('/api/escrow/create') && method === 'post') {
              data = { status: true, message: 'Escrow created', data: { id: '301', payment_link: 'pay.ajobi.app/esc_mock' } };
            } else if (url.includes('/api/escrow/mine') && method === 'get') {
              data = { status: true, message: 'Escrows fetched', data: [{ id: '301', amount: 50000, status: 'awaiting_payment' }] };
            } else if (url.includes('/api/escrow/public/') && method === 'get') {
              data = { status: true, message: 'Public escrow fetched', data: { amount: 50000, description: 'Laptop', status: 'awaiting_payment', payment_url: 'https://paystack.com/pay/mock' } };
            } else if (url.match(/\/api\/escrow\/\d+$/) && method === 'get') {
              data = { status: true, message: 'Escrow fetched', data: { id: '301', status: 'funded', creator_confirmed: false, recipient_confirmed: false } };
            } else if (url.match(/\/api\/escrow\/\d+\/confirm/) && method === 'post') {
              data = { status: true, message: 'Confirmed successfully', data: { status: 'awaiting_confirmation' } };
            }

            // --- Feature 5: Admin Panel ---
            else if (url.includes('/api/admin/transactions') && method === 'get') {
              data = { status: true, message: 'Transactions fetched', data: [] };
            } else if (url.includes('/api/admin/escrow/disputed') && method === 'get') {
              data = { status: true, message: 'Disputed escrows fetched', data: [] };
            } else if (url.includes('/api/admin/users') && method === 'get') {
              data = { status: true, message: 'Users fetched', data: [] };
            } else if (url.match(/\/api\/admin\/escrow\/\d+\/(release|refund)/) && method === 'post') {
              data = { status: true, message: 'Action completed', data: null };
            } else if (url.match(/\/api\/admin\/users\/\d+\/ban/) && method === 'post') {
              data = { status: true, message: 'User banned', data: null };
            }

            // Legacy endpoints (keeping for backward compatibility temporarily)
            else if (url.includes('/api/savings/overview')) {
              data = { status: true, message: '', data: { total_savings: 1500000, active_goals: 2, recent_activity: [] } };
            } else if (url.includes('/api/settings/profile')) {
              data = { status: true, message: '', data: { full_name: 'John Doe', phone: '+2348000000000' } };
            } else {
               // Fallback mock
               data = { status: true, message: 'Mock fallback response', data: {} };
            }
          } catch (e) {
             data = { status: false, message: 'Mock Error', data: null };
          }

          resolve({
            data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: {}
          } as any);
        }, 500); // 500ms delay
      });
    };
    return config;
  });
}
