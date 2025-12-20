import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    accountType: string;
    status: string;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    loading: true, // مهم برای refresh
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
