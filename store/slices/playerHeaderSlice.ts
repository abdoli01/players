// store/slices/playerHeaderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HeaderPlayerResponseDto } from "@/types/header";

interface PlayerHeaderState {
    header: HeaderPlayerResponseDto | null;
}

const initialState: PlayerHeaderState = {
    header: null,
};

const playerHeaderSlice = createSlice({
    name: "playerHeader",
    initialState,
    reducers: {
        setPlayerHeader(state, action: PayloadAction<HeaderPlayerResponseDto>) {
            state.header = action.payload;
        },
        clearPlayerHeader(state) {
            state.header = null;
        },
    },
});

export const { setPlayerHeader, clearPlayerHeader } = playerHeaderSlice.actions;
export default playerHeaderSlice.reducer;
