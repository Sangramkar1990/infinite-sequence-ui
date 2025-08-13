import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { shareService } from "../services/api";

// Async thunk for fetching share by sequence_id
export const fetchShareBySequenceId = createAsyncThunk(
  'share/fetchBySequenceId',
  async (sequence_id, { rejectWithValue }) => {
    try {
      const response = await shareService.getShareBySequenceId(sequence_id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch share');
    }
  }
);

// Async thunk for creating a share
export const createShare = createAsyncThunk(
  'share/create',
  async (shareData, { rejectWithValue }) => {
    try {
      // shareData should include: sequence_id, name, entire_org, organization_id, team_ids
      const response = await shareService.createShare(shareData);
      if (response.success) {
        return response.share;
      } else {
        return rejectWithValue(response.message || 'Failed to create share');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create share');
    }
  }
);

export const updateShare = createAsyncThunk(
  'share/update',
  async ({ sequence_id, data }, { rejectWithValue }) => {
    try {
      // data should include: name, entire_org, team_ids
      const response = await shareService.updateShare(sequence_id, data);
      if (response.success) {
        return response.share;
      } else {
        return rejectWithValue(response.message || 'Failed to update share');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update share');
    }
  }
);

const initialState = {
  currentShare: null,
  shares: [],
  loading: false,
  error: null,
  success: false
};

const shareSlice = createSlice({
  name: "share",
  initialState,
  reducers: {
    clearShare: (state) => {
      state.currentShare = null;
      state.error = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch share by sequence_id
      .addCase(fetchShareBySequenceId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShareBySequenceId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShare = action.payload;
        state.error = null;
      })
      .addCase(fetchShareBySequenceId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentShare = null;
      })
      // Create share
      .addCase(createShare.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createShare.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShare = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(createShare.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update share
      .addCase(updateShare.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateShare.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShare = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(updateShare.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const { clearShare, clearError, clearSuccess } = shareSlice.actions;
export default shareSlice.reducer;