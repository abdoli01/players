import { AppDispatch } from "./index";
import { clearUser } from "./slices/userSlice";
import { clearCurrentSeasonId } from "./slices/seasonSlice";
import { clearPlayer } from "./slices/playerSlice";
import { clearPlayerHeader } from "./slices/playerHeaderSlice";
import { baseApi } from "@/services/api/baseApi";

/**
 * پاک کردن همه sliceهای مرتبط با کاربر هنگام لاگ‌اوت
 */
export function clearAppState(dispatch: AppDispatch) {
    dispatch(clearUser());
    dispatch(clearCurrentSeasonId());
    dispatch(clearPlayer());
    dispatch(clearPlayerHeader());
    dispatch(baseApi.util.resetApiState()); // 🔥

}
