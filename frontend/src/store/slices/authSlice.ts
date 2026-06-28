import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, UserData, LoginResponse, RegisterResponse } from '@/services/authService';


interface AuthState {
  user: UserData | null | any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  onboardingComplete: boolean | string | null;
}

const initialState: AuthState = {
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  isLoading: false,
  error: null,
  onboardingComplete: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('onboardingComplete') || 'null') : null,
};

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (response.status) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      // const response = await axios.post(
      //   `${BASE_URL}/api/auth/login`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`
      //     }
      //   }
      // );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.onboardingComplete = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('onboardingComplete');
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<UserData | null>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        if (action.payload) {
          state.onboardingComplete = action.payload.onboarding_complete;
          localStorage.setItem('user', JSON.stringify(action.payload));
          localStorage.setItem('onboardingComplete', JSON.stringify(action.payload.onboarding_complete));
        }
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload?.data?.token || null;
        state.onboardingComplete = action.payload?.data?.onboarding_complete || false;
        state.user = action.payload?.data || null;
        
        if (action.payload?.data?.token) {
          localStorage.setItem('token', action.payload.data.token);
        }
        if (action.payload?.data) {
          localStorage.setItem('user', JSON.stringify(action.payload.data));
          localStorage.setItem('onboardingComplete', JSON.stringify(action.payload.data.onboarding_complete || false));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload?.data?.token || null;
        state.onboardingComplete = action.payload?.data?.onboarding_complete || false;
        state.user = action.payload?.data || null;

        if (action.payload?.data?.token) {
          localStorage.setItem('token', action.payload.data.token);
        }
        if (action.payload?.data) {
          localStorage.setItem('user', JSON.stringify(action.payload.data));
          localStorage.setItem('onboardingComplete', JSON.stringify(action.payload.data.onboarding_complete || false));
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setAuthError } = authSlice.actions;
export default authSlice.reducer;
