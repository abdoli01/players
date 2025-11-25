import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
    value: number;
}

const initialState: CounterState = {
    value: 0,
};

const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => {
            state.value++;
        },
        decrement: (state) => {
            state.value--;
        },
        increaseBy: (state, action) => {
            state.value += action.payload;
        },
    },
});

export const { increment, decrement, increaseBy } = counterSlice.actions;

export default counterSlice.reducer;
