import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { settingsService } from '@/services/settingsService';

interface SettingsState {
  profile: any | null;
  security: any | null;
  notifications: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  profile: null,
  security: null,
  notifications: null,
  isLoading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'settings/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await settingsService.getProfile();
      if (response.status) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.isLoading = true; })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default settingsSlice.reducer;