"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentSeasonId } from "@/store/slices/seasonSlice";
import { useGetSettingsCurrentSeasonIdQuery } from "@/services/api/settingsApi";

export default function SeasonInitializer() {
    const dispatch = useAppDispatch();

    const storedSeasonId = useAppSelector(
        (s) => s.season.currentSeasonId
    );

    const user = useAppSelector((s) => s.user.user);

    const { data: currentSeasonId } =
        useGetSettingsCurrentSeasonIdQuery(undefined, {
            skip: !user || !!storedSeasonId,
        });

    useEffect(() => {
        if (!storedSeasonId && currentSeasonId) {
            dispatch(setCurrentSeasonId(currentSeasonId));
        }
    }, [currentSeasonId, storedSeasonId, dispatch]);

    return null;
}