// =======================
// SEASON
// =======================
// export type CurrentSeasonId = string;
export interface CurrentSeasonId {
    currentSeasonId: string;
}

export interface UpdateSeasonDto {
    currentSeasonId: string;
}

// =======================
// ACCOUNT TYPES
// =======================
export interface VisibleAccountType {
    title: string;
    key: string;
}

export interface VisibleAccountTypeManagement extends VisibleAccountType {
    visible: boolean;
}

export interface UpdateVisibleAccountTypesDto {
    visibleAccountTypes: string[];
}
export interface VisibleAccountTypesManagementResponse {
    items: VisibleAccountTypeManagement[];
}

// =======================
// DARK MODE
// =======================
export interface DarkModeResponse {
    defaultDarkMode: boolean;
}

export interface UpdateDarkModeDto {
    defaultDarkMode: boolean;
}

// =======================
// LANGUAGE
// =======================
export interface LanguageResponse {
    defaultLanguageId: string;
}

export interface UpdateLanguageDto {
    defaultLanguageId: string;
}

// =======================
// LANGUAGES LIST
// =======================
export interface VisibleLanguage {
    id: string;
    fullName: string;
    code: string;
}

export interface VisibleLanguageManagement extends VisibleLanguage {
    visible: boolean;
}

export interface UpdateVisibleLanguagesDto {
    visibleLanguageIds: string[];
}

// =======================
// WORD TO LANGUAGES
// =======================
export interface WordToLanguagesVersion {
    version: number;
}

export interface WordToLanguagesItem {
    key: string;
    values: Record<string, string>;
}

export interface WordToLanguagesListResponse {
    version: number;
    items: WordToLanguagesItem[];
}