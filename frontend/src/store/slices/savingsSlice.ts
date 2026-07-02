import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { savingsService } from '@/services/savingsService';

interface SavingsState {
  balance: number;
  balanceDiff: number;
  goals: any[];
  automationRules: any[];
  activities: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SavingsState = {
  balance: 0,
  balanceDiff: 0,
  goals: [],
  automationRules: [],
  activities: [],
  isLoading: false,
  error: null,
};

export const fetchSavingsOverview = createAsyncThunk(
  'savings/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await savingsService.getOverview();
      if (response.status) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSavingsGoals = createAsyncThunk(
  'savings/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await savingsService.getGoals();
      if (response.status) {
        return response.data || [];
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const savingsSlice = createSlice({
  name: 'savings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavingsOverview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSavingsOverview.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload) {
          state.balance = action.payload.total_savings || 0;
          state.balanceDiff = 0;
        }
      })
      .addCase(fetchSavingsOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSavingsGoals.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.goals = action.payload;
      });
  },
});

export default savingsSlice.reducer;