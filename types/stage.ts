// types/stage.ts

export type StageType = "LEAGUE" | "KNOCKOUT" | "GROUP";

export interface Stage {
    id: string;
    fullName: string;
    shortName: string | null;
    fullNameEn: string | null;
    shortNameEn: string | null;
    type: StageType;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateStageDto {
    fullName: string;
    shortName?: string | null;
    fullNameEn?: string | null;
    shortNameEn?: string | null;
    type?: StageType;
}

export interface UpdateStageDto {
    fullName?: string;
    shortName?: string | null;
    fullNameEn?: string | null;
    shortNameEn?: string | null;
    type?: StageType;
}

export interface StageSearchParams {
    q?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    type?: StageType;
}