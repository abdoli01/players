"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentSeasonId } from "@/store/slices/seasonSlice";
import { useGetCurrentSeasonIdQuery } from "@/services/api/settingsApi";

export default function SeasonInitializer() {
    const dispatch = useAppDispatch();
    const storedSeasonId = useAppSelector(s => s.season.currentSeasonId);
    const user = useAppSelector(s => s.user.user); // ✅ اضافه شد

    const { data: seasonId } = useGetCurrentSeasonIdQuery(undefined, {
        skip: !user || !!storedSeasonId, // ⚡ اگر user نیست یا seasonId داریم، skip
    });

    useEffect(() => {
        if (seasonId && !storedSeasonId) {
            dispatch(setCurrentSeasonId(seasonId.currentSeasonId));
        }
    }, [seasonId, storedSeasonId, dispatch]);

    return null;
}
