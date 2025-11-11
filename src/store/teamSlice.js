import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teamService } from '../services/api';

// Async thunk to fetch teams by organization ID
export const fetchTeamsByOrganization = createAsyncThunk(
  'teams/fetchTeamsByOrganization',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await teamService.getTeamsByOrganization(organizationId);
      console.log("teamSlice - API Response Data:", response); 
      return response; // Assuming the API returns data in a 'data' field
    } catch (error) {
        console.error("teamSlice - API Error:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    teams: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamsByOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamsByOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeamsByOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teamSlice.reducer;