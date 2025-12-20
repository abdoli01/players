"use client";

import { Provider } from "react-redux";
import { store } from "./index";
import AuthInitializer from "./AuthInitializer";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>
        <AuthInitializer />
        {children}
    </Provider>;
}
