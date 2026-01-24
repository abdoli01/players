"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentSeasonId } from "@/store/slices/seasonSlice";
import { useGetCurrentSeasonIdQuery } from "@/services/api/settingsApi";

export default function SeasonInitializer() {
    const dispatch = useAppDispatch();
    const storedSeasonId = useAppSelector(s => s.season.currentSeasonId);

    const { data: seasonId } = useGetCurrentSeasonIdQuery(undefined, {
        skip: !!storedSeasonId,
    });

    useEffect(() => {
        if (seasonId && !storedSeasonId) {
            dispatch(setCurrentSeasonId(seasonId));
        }
    }, [seasonId, storedSeasonId, dispatch]);

    return null;
}
