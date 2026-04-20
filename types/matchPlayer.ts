export interface MatchPlayer {
    id: string;

    matchId: string;
    teamSeasonToTournamentSeasonId: string;
    playerId: string;

    positionId?: string;
}

// POST /match-players
export interface CreateMatchPlayerDto {
    matchId: string; // required
    teamSeasonToTournamentSeasonId: string; // required
    playerId: string; // required
    positionId?: string;
}

// PATCH /match-players/{id}
export interface UpdateMatchPlayerDto {
    matchId?: string;
    teamSeasonToTournamentSeasonId?: string;
    playerId?: string;
    positionId?: string;
}

// query params (GET /search)
export interface MatchPlayerSearchParams {
    matchId?: string;
    teamSeasonToTournamentSeasonId?: string;
    playerId?: string;
    positionId?: string;
}