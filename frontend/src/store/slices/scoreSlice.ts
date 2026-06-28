import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { scoreService, AjoScoreData, ScoreHistoryItem, ScoreEvent, EligibilityData } from '@/services/scoreService';

interface ScoreState {
  ajoScore: AjoScoreData | null;
  history: ScoreHistoryItem[];
  events: ScoreEvent[];
  eligibility: EligibilityData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ScoreState = {
  ajoScore: null,
  history: [],
  events: [],
  eligibility: null,
  isLoading: false,
  error: null,
};

export const fetchAjoScore = createAsyncThunk(
  'score/fetchAjoScore',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await scoreService.getAjoScore(userId);
      // const response = await scoreService.getAjoScore();
      console.log("ajo score", response);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchScoreHistory = createAsyncThunk(
  'score/fetchScoreHistory',
  async ({ userId, days }: { userId: string; days?: 30 | 60 | 90 }, { rejectWithValue }) => {
    try {
      const response = await scoreService.getScoreHistory(userId, days);
      if (response.success) {
        return response.data.history;
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchScoreEvents = createAsyncThunk(
  'score/fetchScoreEvents',
  async ({ userId, limit, offset }: { userId: string; limit?: number; offset?: number }, { rejectWithValue }) => {
    try {
      const response = await scoreService.getScoreEvents(userId, limit, offset);
      if (response.success) {
        return response.data.events;
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEligibility = createAsyncThunk(
  'score/fetchEligibility',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await scoreService.getEligibility(userId);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAjoScore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAjoScore.fulfilled, (state, action: PayloadAction<AjoScoreData | null>) => {
        state.isLoading = false;
        state.ajoScore = action.payload;
      })
      .addCase(fetchAjoScore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchScoreHistory.fulfilled, (state, action: PayloadAction<ScoreHistoryItem[]>) => {
        state.history = action.payload;
      })
      .addCase(fetchScoreEvents.fulfilled, (state, action: PayloadAction<ScoreEvent[]>) => {
        state.events = action.payload;
      })
      .addCase(fetchEligibility.fulfilled, (state, action: PayloadAction<EligibilityData | null>) => {
        state.eligibility = action.payload;
      });
  },
});

export default scoreSlice.reducer;
