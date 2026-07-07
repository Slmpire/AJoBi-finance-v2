import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { groupsService, CreateGroupPayload, JoinGroupPayload } from '@/services/groupsService';

export interface GroupItem {
  id: string;
  name: string;
  type: string;
  contribution: string;
  nextPayout: string;
  position: string;
  status: 'Paid' | 'Pending' | 'Missed';
  members: number;
  avatars: string[];
}

interface GroupsState {
  myGroups: GroupItem[];
  publicGroups: any[];
  currentGroupDetail: any | null;
  matchedGroups: any[];
  contributionHistory: any[];
  isLoading: boolean;
  isCreating: boolean;
  isJoining: boolean;
  isMatching: boolean;
  error: string | null;
  createError: string | null;
  joinError: string | null;
  matchError: string | null;
}

const initialState: GroupsState = {
  myGroups: [],
  publicGroups: [],
  currentGroupDetail: null,
  matchedGroups: [],
  contributionHistory: [],
  isLoading: false,
  isCreating: false,
  isJoining: false,
  isMatching: false,
  error: null,
  createError: null,
  joinError: null,
  matchError: null,
};

export const fetchMyGroups = createAsyncThunk(
  'groups/fetchMyGroups',
  async (_userId: any, { rejectWithValue }) => {
    try {
      const response = await groupsService.getMyGroups();
      if (response.status && response.data) {
        return response.data.map((g: any) => ({
          id: String(g.id),
          name: g.name,
          type: `${g.frequency?.charAt(0).toUpperCase() + g.frequency?.slice(1)} Rotation`,
          contribution: `₦${parseFloat(g.contribution_amount).toLocaleString()}`,
          nextPayout: g.next_collection_date
            ? new Date(g.next_collection_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Awaiting start',
          position: `${g.rotation_position || 1}`,
          status: g.my_payment_status === 'paid' ? 'Paid' : g.my_payment_status === 'failed' ? 'Missed' : 'Pending',
          members: parseInt(g.member_count || g.max_members || 0),
          avatars: [],
        }));
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPublicGroups = createAsyncThunk(
  'groups/fetchPublicGroups',
  async (_params: void, { rejectWithValue }) => {
    try {
      // No public groups endpoint yet — return empty
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (payload: CreateGroupPayload, { rejectWithValue }) => {
    try {
      const response = await groupsService.createGroup(payload);
      if (response.status) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to create group');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGroupDetail = createAsyncThunk(
  'groups/fetchGroupDetail',
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await groupsService.getGroupDetail(groupId);
      if (response.status) {
        return response.data;
      }
      return rejectWithValue('Failed to fetch group details');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinGroup = createAsyncThunk(
  'groups/joinGroup',
  async (payload: JoinGroupPayload, { rejectWithValue }) => {
    try {
      const response = await groupsService.joinGroup(payload);
      if (response.status) {
        return response.data;
      }
      return rejectWithValue('Failed to join group');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const autoMatchGroup = createAsyncThunk(
  'groups/autoMatchGroup',
  async (_payload: any, { rejectWithValue }) => {
    // Not implemented yet
    return rejectWithValue('Auto match not available yet');
  }
);

export const setupDirectDebitMandate = createAsyncThunk(
  'groups/setupDirectDebitMandate',
  async ({ groupId }: { groupId: string; payload?: any }, { rejectWithValue }) => {
    try {
      const response = await groupsService.setupDebit(groupId);
      if (response.status) {
        return response.data;
      }
      return rejectWithValue('Failed to setup payment');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGroupContributionHistory = createAsyncThunk(
  'groups/fetchGroupContributionHistory',
  async ({ groupId }: { groupId: string; cycle?: string }, { rejectWithValue }) => {
    try {
      const response = await groupsService.getGroupPayments(groupId);
      if (response.status) {
        return response.data || [];
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearMatchError: (state) => { state.matchError = null; },
    clearJoinError: (state) => { state.joinError = null; },
    clearCreateError: (state) => { state.createError = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyGroups.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyGroups.fulfilled, (state, action: PayloadAction<GroupItem[]>) => {
        state.isLoading = false;
        state.myGroups = action.payload;
      })
      .addCase(fetchMyGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPublicGroups.fulfilled, (state, action) => {
        state.publicGroups = action.payload;
      })
      .addCase(createGroup.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createGroup.fulfilled, (state) => { state.isCreating = false; })
      .addCase(createGroup.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      })
      .addCase(fetchGroupDetail.pending, (state) => { state.isLoading = true; })
      .addCase(fetchGroupDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGroupDetail = action.payload;
      })
      .addCase(fetchGroupDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(joinGroup.pending, (state) => {
        state.isJoining = true;
        state.joinError = null;
      })
      .addCase(joinGroup.fulfilled, (state) => { state.isJoining = false; })
      .addCase(joinGroup.rejected, (state, action) => {
        state.isJoining = false;
        state.joinError = action.payload as string;
      })
      .addCase(autoMatchGroup.pending, (state) => {
        state.isMatching = true;
        state.matchError = null;
      })
      .addCase(autoMatchGroup.fulfilled, (state) => {
        state.isMatching = false;
        state.matchedGroups = [];
      })
      .addCase(autoMatchGroup.rejected, (state, action) => {
        state.isMatching = false;
        state.matchError = action.payload as string;
      })
      .addCase(fetchGroupContributionHistory.fulfilled, (state, action) => {
        state.contributionHistory = action.payload;
      });
  },
});

export const { clearMatchError, clearJoinError, clearCreateError } = groupsSlice.actions;
export default groupsSlice.reducer;