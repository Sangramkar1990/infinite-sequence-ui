import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import { cardService, sequenceService } from '../services/api';

const API_BASE_URL = 'http://localhost:5001/api';

// Async Thunks

export const fetchUserSequences = createAsyncThunk(
  'flowEditor/fetchUserSequences',
  async (_, { rejectWithValue }) => {
    try {
      const result = await sequenceService.getAllSequences();
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch sequences');
    }
  }
);

export const fetchSequenceById = createAsyncThunk(
  'flowEditor/fetchSequenceById',
  async (sequenceId, { rejectWithValue }) => {
    try {
      const result = await sequenceService.getSequenceWithId(sequenceId);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch sequence');
    }
  }
);

export const saveSequence = createAsyncThunk(
  'flowEditor/saveSequence',
  async ({ sequenceId, cardsData }, { rejectWithValue }) => {
    try {
      const response = await sequenceService.updateSequence(sequenceId, { cards: cardsData });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to save sequence');
    }
  }
);

export const searchCards = createAsyncThunk(
  'flowEditor/searchCards',
  async (query, { rejectWithValue }) => {
    if (!query.trim()) return []; // Return empty if query is empty, handled in component too
    try {
      const response = await cardService.searchCards(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search cards');
    }
  }
);

export const fetchCardById = createAsyncThunk(
  'flowEditor/fetchCardById',
  async (cardId, { rejectWithValue }) => {
    try {
      const result = await cardService.getCardById(cardId);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch card');
    }
  }
);

export const deleteCard = createAsyncThunk(
  'flowEditor/deleteCard',
  async (cardId, { rejectWithValue }) => {
    try {
      await cardService.deleteCard(cardId);
      return cardId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete card');
    }
  }
);

export const deleteSequence = createAsyncThunk(
  'flowEditor/deleteSequence',
  async (sequenceId, { rejectWithValue }) => {
    try {
      await cardService.deleteCard(sequenceId);
      return sequenceId; // Return deleted id for reducer
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete sequence');
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
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        // Optionally remove card from currentSequence/cards if needed
      })
      .addCase(deleteCard.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteSequence.fulfilled, (state, action) => {
        state.sequences = state.sequences.filter(seq => seq.id !== action.payload);
        if (state.currentSequence && state.currentSequence.id === action.payload) {
          state.currentSequence = null;
        }
      })
      .addCase(deleteSequence.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearFlowEditorError, clearSaveError, clearSearchError, resetSearchResults } = flowEditorSlice.actions;

export default flowEditorSlice.reducer;