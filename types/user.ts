// types/user.ts
export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    accountType: "PLAYER" | "ADMIN";
    metricaPlayerId?: string;
    expireDate?: string | null;
    playerId?: string | null;
}
// types/userSearch.ts
export interface UserSearchParams {
    q?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    accountType?: "PLAYER" | "ADMIN";
    metricaPlayerId?: string;
}
export interface SetPlayerIdDto {
    playerId: string; // شناسه بازیکن
}

export interface AdminSetPlayerIdDto {
    userId: string;   // شناسه کاربر
    playerId: string; // شناسه بازیکن
}

export type UpdateProfileDto = {
    firstName: string;
    lastName: string;
};

export type ChangePasswordDto = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};