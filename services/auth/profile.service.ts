import { fetcher } from "../http/fetcher";
import { UserProfile } from "./types";

export const profileService = {
    getProfile: () =>
        fetcher<UserProfile>("/users/profile"),
};
