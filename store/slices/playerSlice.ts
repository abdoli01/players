// store/slices/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "@/types/player";

interface PlayerState {
    player: Player | null;
}

const initialState: PlayerState = {
    player: null,
};

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setPlayer(state, action: PayloadAction<Player>) {
            state.player = action.payload;
        },
        clearPlayer(state) {
            state.player = null;
        },
    },
});

export const { setPlayer, clearPlayer } = playerSlice.actions;
export default playerSlice.reducer;
