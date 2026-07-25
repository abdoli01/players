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
    console.log("Current seasonId: 777", currentSeasonId);

    useEffect(() => {
        if (!storedSeasonId && currentSeasonId) {
            dispatch(setCurrentSeasonId(currentSeasonId.currentSeasonId));
        }
    }, [currentSeasonId, storedSeasonId, dispatch]);

    return null;
}