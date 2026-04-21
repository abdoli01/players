// types/word.ts

export interface Word {
    id: string;
    title: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateWordDto {
    title: string;
}

export interface UpdateWordDto {
    title?: string;
}

export interface WordSearchParams {
    q?: string;
    title?: string;
}