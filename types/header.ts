// types/header.ts

export interface HeaderParams {
    keyword: "PLAYER" | "CLUB";
    playerId?: string;        // الزامی اگر keyword = PLAYER
    currentSeasonId?: string; // الزامی اگر keyword = PLAYER
}

export interface HeaderResponse {
    full_name: string;
    image: string;
    club: string;
    kitNumber: string;
    age: number;
}
