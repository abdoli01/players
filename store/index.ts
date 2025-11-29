import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/services/baseApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import counterReducer from "./slices/counterSlice";
import userReducer from './slices/userSlice'


export const store = configureStore({
    reducer: {
        counter: counterReducer,
        user: userReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});
setupListeners(store.dispatch);

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
