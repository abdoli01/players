// types/wordToLanguage.ts

export interface WordToLanguage {
    id: string;
    wordId: string;
    languageId: string;
    title: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateWordToLanguageDto {
    wordId: string;
    languageId: string;
    title: string;
}

export interface UpdateWordToLanguageDto {
    wordId?: string;
    languageId?: string;
    title?: string;
}

export interface WordToLanguageSearchParams {
    q?: string;
    wordId?: string;
    languageId?: string;
    title?: string;
}