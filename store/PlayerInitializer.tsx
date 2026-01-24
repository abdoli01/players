"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPlayer, clearPlayer } from "@/store/slices/playerSlice";
import { useGetPlayerByIdQuery } from "@/services/api/playersApi";

export default function PlayerInitializer() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((s) => s.user.user);

    const playerId = user?.playerId;

    const {
        data: player,
        isSuccess,
        isError,
    } = useGetPlayerByIdQuery(playerId as string, {
        skip: !playerId, // ⬅️ کنترل واقعی اینجاست
    });

    useEffect(() => {
        if (isSuccess && player) {
            dispatch(setPlayer(player));
        }

        if (!playerId) {
            dispatch(clearPlayer());
        }

        if (isError) {
            dispatch(clearPlayer());
        }
    }, [playerId, isSuccess, isError, player, dispatch]);

    return null;
}
