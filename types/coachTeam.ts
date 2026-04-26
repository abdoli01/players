export interface CoachTeam {
    id: string;
    coachId: string;
    teamId: string;
    startDate?: string | null;
    endDate?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

// ------------------------

export interface CreateCoachTeamDto {
    coachId: string;
    teamId: string;
    startDate?: string | null;
    endDate?: string | null;
}

// ------------------------

export interface UpdateCoachTeamDto {
    coachId?: string;
    teamId?: string;
    startDate?: string | null;
    endDate?: string | null;
}

// ------------------------

export interface CoachTeamSearchParams {
    q?: string;
    coachId?: string;
    teamId?: string;
}