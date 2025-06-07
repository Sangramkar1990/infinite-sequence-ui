import { configureStore } from "@reduxjs/toolkit";
import sequenceReducer from "./sequenceSlice";

export const store = configureStore({
    reducer: {
        sequence: sequenceReducer
    }
});