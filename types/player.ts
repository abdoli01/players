// types/player.ts

export interface Player {
    id: string;
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    nationalId?: string;
    passportId?: string;
    birthday?: string;
    countryId?: number;
    height?: number;
    corePlayerId?: number;
    image?: string;
}

export interface CreatePlayerDto {
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    nationalId?: string;
    passportId?: string;
    birthday?: string;
    countryId?: number;
    height?: number;
    corePlayerId?: number;
    image?: string;
}

export type UpdatePlayerDto = Partial<CreatePlayerDto>;

export interface PlayerSearchParams {
    q?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    nationalId?: string;
    passportId?: string;
    birthday?: string;
    countryId?: number;
    height?: number;
    corePlayerId?: number;
    image?: string;
}
