"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPlayerHeader, clearPlayerHeader } from "@/store/slices/playerHeaderSlice";
import { useGetPlayerHeaderQuery } from "@/services/api/headerApi";

export default function PlayerHeaderInitializer() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(s => s.user.user);
    const seasonId = useAppSelector(s => s.season.currentSeasonId);
    const storedHeader = useAppSelector(s => s.playerHeader.header);

    const playerId = user?.playerId;

    const { data, isSuccess, isError } = useGetPlayerHeaderQuery(
        { playerId: playerId!, seasonId: seasonId! },
        {
            skip: !playerId || !seasonId || !!storedHeader,
        }
    );

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setPlayerHeader(data));
        }

        if (!playerId || !seasonId || isError) {
            dispatch(clearPlayerHeader());
        }
    }, [playerId, seasonId, isSuccess, isError, data, dispatch]);

    return null;
}
