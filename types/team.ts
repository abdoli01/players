// types/team.ts

export interface Team {
    id: string;
    clubId: string;
    sportId: string;
    teamLevelId: string;
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    continentId?: string;
    countryId?: string;
    provinceId?: string;
    cityId?: string;
}

export interface CreateTeamDto {
    clubId: string;
    sportId: string;
    teamLevelId: string;
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    continentId?: string;
    countryId?: string;
    provinceId?: string;
    cityId?: string;
}

export interface UpdateTeamDto {
    clubId?: string;
    sportId?: string;
    teamLevelId?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    continentId?: string;
    countryId?: string;
    provinceId?: string;
    cityId?: string;
}

export interface TeamSearchParams {
    q?: string;
    clubId?: string;
    sportId?: string;
    teamLevelId?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    continentId?: string;
    countryId?: string;
    provinceId?: string;
    cityId?: string;
}
