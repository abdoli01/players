export interface Stadium {
    id: string;
    fullName: string;
    shortName: string | null;
    fullNameEn: string | null;
    shortNameEn: string | null;
    countryId: string | null;
    provinceId: string | null;
    cityId: string | null;
    capacity: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateStadiumDto {
    fullName: string;
    shortName?: string | null;
    fullNameEn?: string | null;
    shortNameEn?: string | null;
    countryId?: string | null;
    provinceId?: string | null;
    cityId?: string | null;
    capacity?: number | null;
}

export interface UpdateStadiumDto {
    fullName?: string;
    shortName?: string | null;
    fullNameEn?: string | null;
    shortNameEn?: string | null;
    countryId?: string | null;
    provinceId?: string | null;
    cityId?: string | null;
    capacity?: number | null;
}