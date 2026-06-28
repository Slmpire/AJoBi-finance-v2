import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { savingsService, SavingsGoal, AutomationRule, SavingsActivity } from '@/services/savingsService';

interface SavingsState {
  balance: number;
  balanceDiff: number;
  goals: SavingsGoal[];
  automationRules: AutomationRule[];
  activities: SavingsActivity[];
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
      if (response.success) {
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
      if (response.success) {
        return response.data.goals;
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
          state.balance = action.payload.balance;
          state.balanceDiff = action.payload.balance_diff;
        }
      })
      .addCase(fetchSavingsOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSavingsGoals.fulfilled, (state, action: PayloadAction<SavingsGoal[]>) => {
        state.goals = action.payload;
      });
  },
});

export default savingsSlice.reducer;
