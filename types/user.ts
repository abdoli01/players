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