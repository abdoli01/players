// "use client";
//
// import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { setPlayerHeader, clearPlayerHeader } from "@/store/slices/playerHeaderSlice";
// import { useGetPlayerHeaderQuery } from "@/services/api/headerApi";
//
// export default function PlayerHeaderInitializer() {
//     const dispatch = useAppDispatch();
//
//     const user = useAppSelector(s => s.user.user);
//     const seasonId = useAppSelector(s => s.season.currentSeasonId);
//     const storedHeader = useAppSelector(s => s.playerHeader.header);
//     console.log(
//         'seasonId typeof:',
//         typeof seasonId,
//         'value:',
//         seasonId
//     );
//     console.log('userr',user)
//     const playerId = user?.playerId;
//     const isPlayer = user.accountType === "PLAYER";
//     if(!isPlayer) {
//         dispatch(clearPlayerHeader());
//     }
//
//     const { data, isSuccess, isError } = useGetPlayerHeaderQuery(
//         { playerId: playerId!, seasonId: seasonId! },
//         {
//             // skip: !playerId || !seasonId || !!storedHeader,
//             skip: !playerId || !seasonId || !isPlayer ,
//         }
//     );
//
//     useEffect(() => {
//         if (isSuccess && data) {
//             dispatch(setPlayerHeader(data));
//         }
//
//         if (!playerId || !seasonId || isError) {
//             dispatch(clearPlayerHeader());
//         }
//     }, [playerId, seasonId, isSuccess, isError, data, dispatch]);
//
//     return null;
// }


"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    setPlayerHeader,
    clearPlayerHeader,
} from "@/store/slices/playerHeaderSlice";
import { useGetPlayerHeaderQuery } from "@/services/api/headerApi";

export default function PlayerHeaderInitializer() {
    const dispatch = useAppDispatch();

    const user = useAppSelector((s) => s.user.user);
    const seasonId = useAppSelector((s) => s.season.currentSeasonId);
    const storedHeader = useAppSelector((s) => s.playerHeader.header);

    const playerId = user?.playerId;
    const isPlayer = user?.accountType === "PLAYER";

    const { data, isSuccess, isError } = useGetPlayerHeaderQuery(
        { playerId: playerId!, seasonId: seasonId! },
        {
            skip: !playerId || !seasonId || !isPlayer,
        }
    );

    useEffect(() => {
        // ❌ اگر پلیر نیست یا دیتا ناقصه → پاک کن
        if (!isPlayer || !playerId || !seasonId) {
            if (storedHeader) {
                dispatch(clearPlayerHeader());
            }
            return;
        }

        // ❌ اگر API خطا داد → پاک کن
        if (isError) {
            dispatch(clearPlayerHeader());
            return;
        }

        // ✅ موفق → ذخیره کن
        if (isSuccess && data) {
            dispatch(setPlayerHeader(data));
        }
    }, [
        isPlayer,
        playerId,
        seasonId,
        isSuccess,
        isError,
        data,
        storedHeader,
        dispatch,
    ]);

    return null;
}

