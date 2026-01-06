// types/city.ts

export interface City {
    id: string;
    provinceId: string;
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

export interface CreateCityDto {
    provinceId: string;
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

export interface UpdateCityDto {
    provinceId?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

export interface CitySearchParams {
    q?: string;
    provinceId?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}
