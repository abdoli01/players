// store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user: any | null;
    hydrated: boolean; // ✅ فقط همین مهمه
}

const initialState: UserState = {
    user: null,
    hydrated: false, // ⬅️ اول false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
            state.hydrated = true; // ✅ auth check done
        },
        clearUser: (state) => {
            state.user = null;
            state.hydrated = true; // ✅ حتی وقتی لاگین نیست
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
