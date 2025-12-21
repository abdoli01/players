// store/AuthInitializer.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "./hooks";
import { setUser, clearUser } from "./slices/userSlice";
import { profileService } from "@/services/auth";

export default function AuthInitializer() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            dispatch(clearUser());
            router.replace("/login"); // ✅ مهم
            return;
        }

        profileService
            .getProfile()
            .then((user) => {
                dispatch(setUser(user));
            })
            .catch(() => {
                localStorage.removeItem("access_token");
                dispatch(clearUser());
                router.replace("/login");
            });
    }, [dispatch, router]);

    return null;
}
