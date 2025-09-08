import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService, cardService, sequenceService } from "../services/api";

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to fetch user");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to update profile");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.updatePassword(
        oldPassword,
        newPassword
      );
      if (response.success) {
        return response.message || "Password updated successfully.";
      } else {
        return rejectWithValue(response.message || "Failed to update password");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update password");
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout(); // Ensure your backend supports this endpoint
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const fetchCardsByUser = createAsyncThunk(
  "user/fetchCardsByUser",
  async (_, { rejectWithValue }) => {
    try {
      
      const response = await cardService.getCardsByUser();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to fetch cards");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch cards");
    }
  }
);

export const fetchAllSequences = createAsyncThunk(
  "user/fetchAllSequences",
  async (_, { rejectWithValue }) => {
    try {
      console.log("fetching sequences");
      const response = await sequenceService.getAllSequences();
      console.log("response", response);
      if (response.success) {

        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to fetch sequences");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch sequences");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    cards: [],
    loading: false,
    error: null,
    passwordUpdateStatus: null,
    loadedCards: false,
    loadedSequences: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updatePassword.pending, (state) => {
        state.passwordUpdateStatus = null;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.passwordUpdateStatus = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.passwordUpdateStatus = null;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      })
      .addCase(fetchCardsByUser.pending, (state) => {
        state.loadedCards = false;
        state.error = null;
      })
      .addCase(fetchCardsByUser.fulfilled, (state, action) => {
        state.loadedCards = true;
        state.cards = action.payload;
      })
      .addCase(fetchCardsByUser.rejected, (state, action) => {
        state.loadedCards = false;
        state.error = action.payload;
      })
      .addCase(fetchAllSequences.pending, (state) => {
        state.loadedSequences = false;
        state.error = null;
      })
      .addCase(fetchAllSequences.fulfilled, (state, action) => {
        state.loadedSequences = true;
        state.sequences = action.payload;
      })
      .addCase(fetchAllSequences.rejected, (state, action) => {
        state.loadedSequences = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
