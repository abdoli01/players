export interface Group {
    id: string;
    fullName: string;
    shortName: string | null;
    fullNameEn: string | null;
    shortNameEn: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateGroupDto {
    fullName: string;
    shortName?: string | null;
    fullNameEn?: string | null;
    shortNameEn?: string | null;
}

export interface UpdateGroupDto {
    fullName?: string;
    shortName?: string | null;
    fullNameEn?: string | null;
    shortNameEn?: string | null;
}