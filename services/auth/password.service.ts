import { fetcher } from "../http/fetcher";
import { SetPasswordDto, VerifyResetPasswordDto } from "./types";

export const passwordService = {
    setPassword: (data: SetPasswordDto) =>
        fetcher("/users/set-password", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    verifyReset: (data: VerifyResetPasswordDto) =>
        fetcher("/users/verify-code-reset-password", {
            method: "POST",
            body: JSON.stringify(data),
        }),
};
