import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { settingsService, UserProfile, SecuritySettings, NotificationSettings } from '@/services/settingsService';

interface SettingsState {
  profile: UserProfile | null;
  security: SecuritySettings | null;
  notifications: NotificationSettings | null;
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
      if (response.success) {
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
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<UserProfile | null>) => {
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
