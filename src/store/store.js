import { configureStore } from "@reduxjs/toolkit";
import sequenceReducer from "./sequenceSlice";
import flowEditorReducer from "./flowEditorSlice";
import userReducer from "./userSlice";
import shareReducer from "./shareSlice";
import teamReducer from "./teamSlice";

export const store = configureStore({
    reducer: {
        sequence: sequenceReducer,
        flowEditor: flowEditorReducer,
        user: userReducer,
        share: shareReducer,
        team: teamReducer ,
    }
});