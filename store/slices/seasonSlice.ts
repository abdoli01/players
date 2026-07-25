// store/slices/seasonSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SeasonState {
    currentSeasonId: any;
}

const initialState: SeasonState = {
    currentSeasonId: null,
};

const seasonSlice = createSlice({
    name: "season",
    initialState,
    reducers: {
        setCurrentSeasonId(state, action: PayloadAction<string>) {
            console.log('action.payload',action.payload)
            state.currentSeasonId = action.payload;
        },
        clearCurrentSeasonId(state) {
            state.currentSeasonId = null;
        },
    },
});

export const { setCurrentSeasonId, clearCurrentSeasonId } = seasonSlice.actions;
export default seasonSlice.reducer;
