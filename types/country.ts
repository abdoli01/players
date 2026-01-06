// types/country.ts

export interface Country {
    id: string;
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    continentId: string;
}

export interface CreateCountryDto {
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    continentId: string;
}

export interface UpdateCountryDto {
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    continentId?: string;
}

export interface CountrySearchParams {
    q?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    continentId?: string;
}
