// types/tournament.ts

export interface Tournament {
    id: string;
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

export interface CreateTournamentDto {
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

export interface UpdateTournamentDto {
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

export interface TournamentSearchParams {
    q?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}
