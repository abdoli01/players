// store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user: any | null;
    loading: boolean;      // برای loader هنگام fetch پروفایل
    hydrated: boolean;     // مشخص می‌کند اطلاعات کاربر hydrate شده یا نه
}

const initialState: UserState = {
    user: null,
    loading: true,
    hydrated: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        startLoading: (state) => {
            state.loading = true;
        },
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
            state.loading = false;
            state.hydrated = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.loading = false;
            state.hydrated = true;
        },
    },
});

export const { setUser, clearUser, startLoading } = userSlice.actions;
export default userSlice.reducer;
