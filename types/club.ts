// types/club.ts

export interface Club {
    id: string;
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    isNational: boolean;
    image?: string;
    image50?: string;
    image26?: string;
}

export interface CreateClubDto {
    fullName: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    isNational?: boolean;
    image?: string;
    image50?: string;
    image26?: string;
}

export interface UpdateClubDto {
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    isNational?: boolean;
    image?: string;
    image50?: string;
    image26?: string;
}

export interface ClubSearchParams {
    q?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    isNational?: boolean;
    image?: string;
    image50?: string;
    image26?: string;
}
