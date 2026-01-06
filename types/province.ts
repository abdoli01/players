// types/province.ts

export interface Province {
    id: string;
    countryId: string;
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

export interface CreateProvinceDto {
    countryId: string;
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

export interface UpdateProvinceDto {
    countryId?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

export interface ProvinceSearchParams {
    q?: string;
    countryId?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}
