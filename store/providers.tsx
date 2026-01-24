// store/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "./index";
import AuthInitializer from "./AuthInitializer";
import PlayerInitializer from "./PlayerInitializer";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthInitializer />
            <PlayerInitializer />
            {children}
        </Provider>
    );
}
