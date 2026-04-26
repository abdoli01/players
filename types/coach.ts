export interface Coach {
    id: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    nationalId?: string;
    passportId?: string;
    birthday?: string;
    countryId?: string;
    height?: number;
    createdAt?: string;
    updatedAt?: string;
}

// ------------------------

export interface CreateCoachDto {
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    nationalId?: string;
    passportId?: string;
    birthday?: string;
    countryId?: string;
    height?: number;
}

// ------------------------

export interface UpdateCoachDto {
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    nationalId?: string;
    passportId?: string;
    birthday?: string;
    countryId?: string;
    height?: number;
}

// ------------------------

export interface CoachSearchParams {
    q?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    nationalId?: string;
    passportId?: string;
    countryId?: string;
    height?: number;
}