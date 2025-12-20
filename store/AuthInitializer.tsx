// store/AuthInitializer.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { setUser, clearUser, startLoading } from "./slices/userSlice";
import { profileService } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function AuthInitializer() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            dispatch(clearUser());
            router.push("/login");
            return;
        }

        dispatch(startLoading());

        profileService
            .getProfile()
            .then((user) => {
                dispatch(setUser(user));
            })
            .catch((err: any) => {
                // فقط در صورت خطای 401 یا 404 پاک شود
                if (err?.status === 401 || err?.status === 404) {
                    localStorage.removeItem("access_token");
                    dispatch(clearUser());
                    router.push("/login");
                }
            });
    }, [dispatch, router]);

    return null;
}
