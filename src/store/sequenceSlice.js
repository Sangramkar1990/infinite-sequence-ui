import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    sequence: []
};

const sequenceSlice = createSlice({
    name: "sequence",
    initialState,
    reducers:{
        setSequence: (state, action) => {
            state.sequence = action.payload;
        },
        clearSequence: (state) => {
            state.sequence = [];
        }
    }
});

export const { setSequence, clearSequence} = sequenceSlice.actions;
export default sequenceSlice.reducer;