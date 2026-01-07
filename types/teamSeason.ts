export interface TeamSeason {
    id: string
    teamId: string
    seasonId: string
    createdAt?: string
    updatedAt?: string
}

export interface CreateTeamSeasonDto {
    teamId: string
    seasonId: string
}

export type UpdateTeamSeasonDto = Partial<CreateTeamSeasonDto>

export interface TeamSeasonSearchParams {
    q?: string
    teamId?: string
    seasonId?: string
}
