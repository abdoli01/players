export interface Position {
    id: string;

    fullName: string;
    shortName?: string;

    fullNameEn?: string;
    shortNameEn?: string;

    sportId: string;
}

// POST /positions
export interface CreatePositionDto {
    fullName: string; // required
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    sportId: string; // required
}

// PATCH /positions/{id}
export interface UpdatePositionDto {
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    sportId?: string;
}

// SEARCH params
export interface PositionSearchParams {
    q?: string;
    fullName?: string;
    shortName?: string;
    fullNameEn?: string;
    shortNameEn?: string;
    sportId?: string;
}