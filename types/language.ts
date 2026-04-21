// types/language.ts

export interface Language {
    id: string;
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    code?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateLanguageDto {
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    code?: string;
}

export interface UpdateLanguageDto {
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    code?: string;
}

export interface LanguageSearchParams {
    q?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    code?: string;
}