"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSettings, clearSettings } from "@/store/slices/seasonSlice";
import { useGetSettingsQuery } from "@/services/api/settingsApi";

export default function SeasonInitializer() {
    const dispatch = useAppDispatch();
    const storedSettings = useAppSelector(s => s.season.settings);

    const {
        data: settings,
        isSuccess,
        isError,
    } = useGetSettingsQuery(undefined, {
        skip: !!storedSettings, // 👈 اگر تو Redux داریم، حتی dispatch هم نکن
    });

    useEffect(() => {
        if (isSuccess && settings) {
            dispatch(setSettings(settings));
        }

        if (isError) {
            dispatch(clearSettings());
        }
    }, [isSuccess, isError, settings, dispatch]);

    return null;
}
