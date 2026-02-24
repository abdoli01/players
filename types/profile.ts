// types/profile.ts

export type ProfileKeywordType = "PLAYER" | "CLUB";

export interface ProfileKeyDto {
    title: string;
    key: string;
}

export interface ProfileFieldDto {
    title: string;
    key: string;
    value: any;
}

export interface ProfilePieDto {
    // فعلاً خالیه طبق Swagger
    [key: string]: any;
}

export interface ProfileKeyDataDto {
    title: string;
    key: string;
    stats:any
    pie: ProfilePieDto;
    bar: ProfileFieldDto;
}

export interface ProfileResponseDto {
    data: ProfileKeyDataDto;
}

/* -------- Query Params -------- */

export interface GetProfileKeywordsParams {
    keyword: ProfileKeywordType;
}

export interface GetProfileParams {
    keyword: ProfileKeywordType;
    key: string;
    playerId?: string;
    seasonId?: string;
}
