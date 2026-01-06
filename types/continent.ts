// types/continent.ts

export interface Continent {
    id: string;
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

export interface CreateContinentDto {
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

export interface UpdateContinentDto {
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

export interface ContinentSearchParams {
    q?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}
