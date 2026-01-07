// types/settings.ts

export interface CurrentSeason {
    id: string;
    fullName: string;
    shortName: string;
    fullNameEn: string;
    shortNameEn: string;
    createdAt: string;
    updatedAt: string;
}

export interface Settings {
    id: string;
    currentSeasonId: string;
    createdAt: string;
    updatedAt: string;
    currentSeason: CurrentSeason;
}

export interface UpdateSettingsDto {
    currentSeasonId: string;
}
