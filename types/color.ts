// types/color.ts

export interface Color {
    id: string;
    title: string;
    H1: string;
    H2: string;
    G1: string;
    G2: string;
    HG3: string;
    HG4: string;
    ACN1: string;
    ACN2: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateColorDto {
    title: string;
    H1: string;
    H2?: string;
    G1?: string;
    G2?: string;
    HG3?: string;
    HG4?: string;
    ACN1?: string;
    ACN2?: string;
}

export interface UpdateColorDto {
    title?: string;
    H1?: string;
    H2?: string;
    G1?: string;
    G2?: string;
    HG3?: string;
    HG4?: string;
    ACN1?: string;
    ACN2?: string;
}