import { useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";

export function useLogout() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    return () => {
        // 1️⃣ حذف توکن
        localStorage.removeItem("access_token");

        // 2️⃣ پاک کردن user از redux
        dispatch(clearUser());

        // 3️⃣ ریدایرکت (اختیاری)
        router.replace("/login");
    };
}
