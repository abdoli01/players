// store/AuthInitializer.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { setUser, clearUser } from "./slices/userSlice";
import { profileService } from "@/services/auth";

export default function AuthInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            dispatch(clearUser());
            return;
        }

        let cancelled = false; // ✅ اضافه شد

        profileService
            .getProfile()
            .then((user) => {
                if (cancelled) return; // ✅ جلوگیری از race
                dispatch(setUser(user));
            })
            .catch((err: any) => {
                if (cancelled) return; // ✅

                // ✅ فقط خطای auth باعث logout شود
                if (err?.status === 401 || err?.status === 403) {
                    localStorage.removeItem("access_token");
                    dispatch(clearUser());
                }
                // ❌ بقیه خطاها ignore می‌شوند
            });

        return () => {
            cancelled = true; // ✅ cleanup
        };
    }, [dispatch]);

    return null;
}
