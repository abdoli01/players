export interface MatchTransaction {
    id: string;

    matchId: string;
    transactionId: number;

    teamSeasonToTournamentSeasonId?: string;
    playerId?: string;
}

// POST /match-transactions
export interface CreateMatchTransactionDto {
    matchId: string; // required
    transactionId: number; // required

    teamSeasonToTournamentSeasonId?: string;
    playerId?: string;
}

// PATCH /match-transactions/{id}
export interface UpdateMatchTransactionDto {
    matchId?: string;
    transactionId?: number;

    teamSeasonToTournamentSeasonId?: string;
    playerId?: string;
}

// GET /search params
export interface MatchTransactionSearchParams {
    q?: string;

    matchId?: string;
    transactionId?: number;

    teamSeasonToTournamentSeasonId?: string;
    playerId?: string;
}