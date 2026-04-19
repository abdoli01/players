export interface Referee {
    id: string;
    fullName: string;
    shortName: string | null;
    fullNameEn: string | null;
    shortNameEn: string | null;
    nationalId: string | null;
    passportId: string | null;
    birthday: string | null;
    countryId: string | null;
    height: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateRefereeDto {
    fullName: string;
    shortName?: string | null;
    fullNameEn?: string | null;
    shortNameEn?: string | null;
    nationalId?: string | null;
    passportId?: string | null;
    birthday?: string | null;
    countryId?: string | null;
    height?: number | null;
}

export interface UpdateRefereeDto {
    fullName?: string;
    shortName?: string | null;
    fullNameEn?: string | null;
    shortNameEn?: string | null;
    nationalId?: string | null;
    passportId?: string | null;
    birthday?: string | null;
    countryId?: string | null;
    height?: number | null;
}