import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cardService, sequenceService} from '../services/api';

export const fetchCardsByUser = createAsyncThunk(
    'sequences/fetchCardsByUser',
    async () => {
        const response = await cardService.getCardsByUser();
        return response;
    }
);
export const fetchAllCards = createAsyncThunk(
    'sequences/fetchAllCards',
    async () => {
        const response = await cardService.getAllCards();
        return response;
    }
);

export const searchCards = createAsyncThunk(
    'sequences/searchCards',
    async (query) => {
        const response = await cardService.searchCards(query);
        return response;
    }
);

export const fetchAllSequences = createAsyncThunk(
    'sequences/fetchAllSequences',
    async () => {
        const response = await sequenceService.getFullSequences();
        return response;
    }
);

export const fetchMySequences = createAsyncThunk( // New thunk for fetching user's sequences
    'sequences/fetchMySequences',
    async () => {
        const response = await sequenceService.getMySequences();
        return response;
    }
);

export const deleteSequence = createAsyncThunk( // New thunk for deleting a sequence
    'sequences/deleteSequence',
    async (sequenceId) => {
        await sequenceService.deleteSequence(sequenceId);
        return sequenceId; // Return the ID of the deleted sequence
    }
);


const initialState = {
    sequence: {},
    sequences: [],
    cards: [],
    loading: 'idle',
    error: null,
};

const sequenceSlice = createSlice({
    name: "sequence",
    initialState,
    reducers:{
        setSequence: (state, action) => {
            state.sequence = action.payload;
        },
        setSequences: (state, action) => {
            state.sequences = action.payload;
        },
        clearSequence: (state) => {
            state.sequence = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCardsByUser.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(fetchCardsByUser.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.cards = action.payload.data;
            })
            .addCase(fetchCardsByUser.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchAllCards.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(fetchAllCards.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.cards = action.payload.data;
            })
            .addCase(fetchAllCards.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
            })
            .addCase(searchCards.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(searchCards.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.cards = action.payload.data;
            })
            .addCase(searchCards.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchAllSequences.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(fetchAllSequences.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.sequences = action.payload;
            })
            .addCase(fetchAllSequences.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchMySequences.pending, (state) => { // Reducers for fetchMySequences
                state.loading = 'loading';
            })
            .addCase(fetchMySequences.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.sequences = action.payload;
            })
            .addCase(fetchMySequences.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteSequence.pending, (state) => { // Reducers for deleteSequence
                state.loading = 'loading';
            })
            .addCase(deleteSequence.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.sequences = state.sequences.filter(
                    (sequence) => sequence.id !== action.payload
                );
            })
            .addCase(deleteSequence.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { setSequence, setSequences, clearSequence} = sequenceSlice.actions;
export default sequenceSlice.reducer;