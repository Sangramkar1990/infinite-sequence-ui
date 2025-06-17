import { configureStore } from "@reduxjs/toolkit";
import sequenceReducer from "./sequenceSlice";
import flowEditorReducer from "./flowEditorSlice";
import userReducer from "./userSlice";

export const store = configureStore({
    reducer: {
        sequence: sequenceReducer,
        flowEditor: flowEditorReducer,
        user: userReducer
    }
});