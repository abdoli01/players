// store/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "./index";
import AuthInitializer from "./AuthInitializer";
// import PlayerInitializer from "./PlayerInitializer";
import SeasonInitializer from "./SeasonInitializer";
import PlayerHeaderInitializer from "./PlayerHeaderInitializer";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthInitializer />
            <SeasonInitializer />
            <PlayerHeaderInitializer />
            {children}
        </Provider>
    );
}
