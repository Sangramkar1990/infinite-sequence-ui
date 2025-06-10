import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:5001/api';

// Helper to get token
const getToken = () => localStorage.getItem('token');

// Async Thunks

export const fetchUserSequences = createAsyncThunk(
  'flowEditor/fetchUserSequences',
  async (_, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue('No authentication token found');
    try {
      const response = await fetch(`${API_BASE_URL}/sequences/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch sequences');
      }
      const result = await response.json();
      return result.data; // Assuming result.data is the array of sequences
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSequenceById = createAsyncThunk(
  'flowEditor/fetchSequenceById',
  async (sequenceId, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue('No authentication token found');
    if (!sequenceId) return rejectWithValue('Sequence ID is required');
    try {
      const response = await fetch(`${API_BASE_URL}/sequences/${sequenceId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch sequence');
      }
      const result = await response.json();
      return result.data; // Assuming result.data contains the sequence details including cards
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveSequence = createAsyncThunk(
  'flowEditor/saveSequence',
  async ({ sequenceId, cardsData }, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue('No authentication token found');
    if (!sequenceId) return rejectWithValue('Sequence ID is required for saving');
    try {
      const response = await fetch(`${API_BASE_URL}/sequences/${sequenceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cards: cardsData }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save sequence');
      }
      const result = await response.json();
      return result; // Or specific data if needed, e.g., result.data or just result.success
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchCards = createAsyncThunk(
  'flowEditor/searchCards',
  async (query, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue('No authentication token found');
    if (!query.trim()) return []; // Return empty if query is empty, handled in component too
    try {
      const response = await fetch(
        `${API_BASE_URL}/sequences/search/cards?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to search cards');
      }
      const result = await response.json();
      return result.data; // Assuming result.data is the array of card search results
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCardById = createAsyncThunk(
  'flowEditor/fetchCardById',
  async (cardId, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue('No authentication token found');
    if (!cardId) return rejectWithValue('Card ID is required');
    try {
      const response = await fetch(`${API_BASE_URL}/sequences/card/${cardId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch card');
      }
      const result = await response.json();
      return result.data; // Assuming result.data contains the card details
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  sequences: [],
  currentSequence: null, // Stores the fully loaded sequence for editing
  searchResults: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  saveStatus: 'idle',
  saveError: null,
  searchStatus: 'idle',
  searchError: null,
  currentCard: null, // Add state for the fetched card
  fetchCardStatus: 'idle', // Add status for fetching a card
  fetchCardError: null, // Add error state for fetching a card
};

const flowEditorSlice = createSlice({
  name: 'flowEditor',
  initialState,
  reducers: {
    clearFlowEditorError: (state) => {
      state.error = null;
    },
    clearSaveError: (state) => {
      state.saveError = null;
    },
    clearSearchError: (state) => {
      state.searchError = null;
    },
    resetSearchResults: (state) => {
      state.searchResults = [];
      state.searchStatus = 'idle';
    }
    // You might want to add reducers for local state changes if any, e.g., updating nodes/edges locally before save
  },
  extraReducers: (builder) => {
    builder
      // fetchUserSequences
      .addCase(fetchUserSequences.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserSequences.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sequences = action.payload;
      })
      .addCase(fetchUserSequences.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchSequenceById
      .addCase(fetchSequenceById.pending, (state) => {
        state.status = 'loading';
        state.currentSequence = null;
        state.error = null;
      })
      .addCase(fetchSequenceById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSequence = action.payload;
        // The existing sequenceSlice setSequence might need to be re-evaluated or integrated.
        // For now, this slice will hold the detailed sequence for the editor.
      })
      .addCase(fetchSequenceById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // saveSequence
      .addCase(saveSequence.pending, (state) => {
        state.saveStatus = 'loading';
        state.saveError = null;
      })
      .addCase(saveSequence.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        // Optionally update currentSequence or refetch if backend returns updated data
        // For now, we assume success means the local state is in sync or will be handled by component
      })
      .addCase(saveSequence.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.saveError = action.payload;
      })
      // searchCards
      .addCase(searchCards.pending, (state) => {
        state.searchStatus = 'loading';
        state.searchError = null;
      })
      .addCase(searchCards.fulfilled, (state, action) => {
        state.searchStatus = 'succeeded';
        state.searchResults = action.payload;
      })
      .addCase(searchCards.rejected, (state, action) => {
        state.searchStatus = 'failed';
        state.searchError = action.payload;
      })
      // fetchCardById
      .addCase(fetchCardById.pending, (state) => {
        state.fetchCardStatus = 'loading';
        state.currentCard = null;
        state.fetchCardError = null;
      })
      .addCase(fetchCardById.fulfilled, (state, action) => {
        state.fetchCardStatus = 'succeeded';
        state.currentCard = action.payload;
      })
      .addCase(fetchCardById.rejected, (state, action) => {
        state.fetchCardStatus = 'failed';
        state.fetchCardError = action.payload;
      });
  },
});

export const { clearFlowEditorError, clearSaveError, clearSearchError, resetSearchResults } = flowEditorSlice.actions;

export default flowEditorSlice.reducer;