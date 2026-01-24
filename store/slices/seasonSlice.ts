// store/slices/seasonSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Settings } from "@/types/settings";

interface SeasonState {
    settings: Settings | null;
}

const initialState: SeasonState = {
    settings: null,
};

const seasonSlice = createSlice({
    name: "season",
    initialState,
    reducers: {
        setSettings(state, action: PayloadAction<Settings>) {
            state.settings = action.payload;
        },
        clearSettings(state) {
            state.settings = null;
        },
    },
});

export const { setSettings, clearSettings } = seasonSlice.actions;
export default seasonSlice.reducer;
