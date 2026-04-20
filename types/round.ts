export interface Round {
    id: string;
    fullName: string;
    shortName: string | null;
    fullNameEn: string | null;
    shortNameEn: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateRoundDto {
    fullName: string;
    shortName?: string | null;
    fullNameEn?: string | null;
    shortNameEn?: string | null;
}

export interface UpdateRoundDto {
    fullName?: string;
    shortName?: string | null;
    fullNameEn?: string | null;
    shortNameEn?: string | null;
}
export type RoundSearchParams = {
    q?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
};