// types/season.ts

export interface Season {
    id: string;
    fullName: string;
    shortName: string;
    fullNameEn: string;
    shortNameEn: string;
}

/**
 * CreateSeasonDto
 * fullName اجباری است
 */
export interface CreateSeasonDto {
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

/**
 * UpdateSeasonDto
 * همه فیلدها اختیاری هستند
 */
export interface UpdateSeasonDto {
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}

export interface SeasonSearchParams {
    q?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
}
