export interface TeamSeasonToTournamentSeason {
    id: string
    teamSeasonId: string
    tournamentSeasonId: string
    createdAt?: string
    updatedAt?: string
}

export interface CreateTeamSeasonToTournamentSeasonDto {
    teamSeasonId: string
    tournamentSeasonId: string
}

export type UpdateTeamSeasonToTournamentSeasonDto =
    Partial<CreateTeamSeasonToTournamentSeasonDto>

export interface TeamSeasonToTournamentSeasonSearchParams {
    q?: string
    teamSeasonId?: string
    tournamentSeasonId?: string
}
