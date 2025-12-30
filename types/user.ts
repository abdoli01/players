// types/user.ts
export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    accountType: "PLAYER" | "ADMIN";
    metricaPlayerId?: string;
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