import { fetcher } from "../http/fetcher";
import { CheckUsernameDto, LoginDto, RegisterDto } from "./types";

export const authService = {
    checkUsername: (data: CheckUsernameDto) =>
        fetcher<{ exists: boolean }>("/users/check-username", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    login: (data: LoginDto) =>
        fetcher("/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    register: (data: RegisterDto) =>
        fetcher("/users/register", {
            method: "POST",
            body: JSON.stringify(data),
        }),
};
