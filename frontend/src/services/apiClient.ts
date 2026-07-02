import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token on every request
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
  (error) => Promise.reject(error)
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

// Standardize error responses
apiClient.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      (response.data.status === false ||
        response.data.success === false ||
        response.data.success === 'false')
    ) {
      const message =
        response.data.error?.message ||
        response.data.message ||
        'An error occurred';
      return Promise.reject(new ApiError(200, message, response.data));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || error.message || 'An error occurred';
      return Promise.reject(new ApiError(status, message, data));
    } else if (error.request) {
      return Promise.reject(
        new ApiError(0, 'No response from server. Please check your network connection.', null)
      );
    } else {
      return Promise.reject(new ApiError(0, error.message, null));
    }
  }
);