// types/color.ts

export interface Color {
    id: string;
    title: string;
    H1: string;
    H2: string | null;
    G1: string | null;
    G2: string | null;
    HG3: string | null;
    HG4: string | null;
    ACN1: string | null;
    ACN2: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateColorDto {
    title: string;
    H1: string;
    H2?: string | null;
    G1?: string | null;
    G2?: string | null;
    HG3?: string | null;
    HG4?: string | null;
    ACN1?: string | null;
    ACN2?: string | null;
}

export interface UpdateColorDto {
    title?: string;
    H1?: string;
    H2?: string | null;
    G1?: string | null;
    G2?: string | null;
    HG3?: string | null;
    HG4?: string | null;
    ACN1?: string | null;
    ACN2?: string | null;
}