export type TournamentSeasonType =
    | "LEAGUE"
    | "KNOCKOUT"
    | "MIXED"
    | "FRIENDLY";

export interface TournamentSeason {
    id: string;
    tournamentId: string;
    seasonId: string;
    type: TournamentSeasonType;
}

export interface CreateTournamentSeasonDto {
    tournamentId: string;
    seasonId: string;
    type: TournamentSeasonType;
}

export type UpdateTournamentSeasonDto =
    Partial<CreateTournamentSeasonDto>;

export interface TournamentSeasonSearchParams {
    q?: string;
    tournamentId?: string;
    seasonId?: string;
    type?: TournamentSeasonType;
}
