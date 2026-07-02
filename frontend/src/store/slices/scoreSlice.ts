import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { scoreService, AjoScoreData, EligibilityData } from '@/services/scoreService';

interface ScoreState {
  ajoScore: AjoScoreData | null;
  history: any[];
  events: any[];
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
  async (_userId: any, { rejectWithValue }) => {
    try {
      const response = await scoreService.getAjoScore();
      if (response.status) {
        return response.data as AjoScoreData;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEligibility = createAsyncThunk(
  'score/fetchEligibility',
  async (_userId: any, { rejectWithValue }) => {
    try {
      const response = await scoreService.getEligibility();
      if (response.status) {
        return response.data as EligibilityData;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchScoreHistory = createAsyncThunk(
  'score/fetchScoreHistory',
  async (_args: any, { rejectWithValue }) => {
    try {
      const response = await scoreService.getScoreHistory();
      if (response.status) {
        return response.data || [];
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchScoreEvents = createAsyncThunk(
  'score/fetchScoreEvents',
  async (_args: any, { rejectWithValue }) => {
    try {
      const response = await scoreService.getScoreEvents();
      if (response.status) {
        return response.data || [];
      }
      return [];
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
      .addCase(fetchScoreHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(fetchScoreEvents.fulfilled, (state, action) => {
        state.events = action.payload;
      })
      .addCase(fetchEligibility.fulfilled, (state, action: PayloadAction<EligibilityData | null>) => {
        state.eligibility = action.payload;
      });
  },
});

export default scoreSlice.reducer;