import { baseApi } from "./baseApi";
import {
    CurrentSeasonId,
    UpdateSeasonDto,
    VisibleAccountType,
    VisibleAccountTypeManagement,
    UpdateVisibleAccountTypesDto,
    DarkModeResponse,
    UpdateDarkModeDto,
    LanguageResponse,
    UpdateLanguageDto,
    VisibleLanguage,
    VisibleLanguageManagement,
    UpdateVisibleLanguagesDto,
    WordToLanguagesVersion,
    WordToLanguagesListResponse,
    VisibleAccountTypesManagementResponse
} from "@/types/settings";

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ==================================================
        // SEASON SETTINGS
        // ==================================================
        getSettingsCurrentSeasonId: builder.query<CurrentSeasonId, void>({
            query: () => "/settings/current-season-id",
            providesTags: ["SETTINGS"],
        }),

        updateSettingsSeason: builder.mutation<void, UpdateSeasonDto>({
            query: (body) => ({
                url: "/settings/season",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["SETTINGS"],
        }),

        // ==================================================
        // ACCOUNT TYPES SETTINGS
        // ==================================================
        getSettingsVisibleAccountTypes: builder.query<VisibleAccountType[], void>({
            query: () => "/settings/visible-account-types",
            providesTags: ["SETTINGS"],
        }),

        getSettingsVisibleAccountTypesManagement: builder.query<
            VisibleAccountTypesManagementResponse,
            void
        >({
            query: () => "/settings/visible-account-types/management",
            providesTags: ["SETTINGS"],
        }),

        updateSettingsVisibleAccountTypes: builder.mutation<
            VisibleAccountTypeManagement[],
            UpdateVisibleAccountTypesDto
        >({
            query: (body) => ({
                url: "/settings/visible-account-types",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["SETTINGS"],
        }),

        // ==================================================
        // DARK MODE SETTINGS
        // ==================================================
        getSettingsDarkMode: builder.query<DarkModeResponse, void>({
            query: () => "/settings/dark-mode",
            providesTags: ["SETTINGS"],
        }),

        updateSettingsDarkMode: builder.mutation<void, UpdateDarkModeDto>({
            query: (body) => ({
                url: "/settings/dark-mode",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["SETTINGS"],
        }),

        // ==================================================
        // LANGUAGE SETTINGS
        // ==================================================
        getSettingsLanguage: builder.query<LanguageResponse, void>({
            query: () => "/settings/language",
            providesTags: ["SETTINGS"],
        }),

        updateSettingsLanguage: builder.mutation<void, UpdateLanguageDto>({
            query: (body) => ({
                url: "/settings/language",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["SETTINGS"],
        }),

        // ==================================================
        // VISIBLE LANGUAGES
        // ==================================================
        getSettingsVisibleLanguages: builder.query<VisibleLanguage[], void>({
            query: () => "/settings/visible-languages",
            providesTags: ["SETTINGS"],
        }),

        getSettingsVisibleLanguagesManagement: builder.query<
            { items: VisibleLanguageManagement[] },
            void
        >({
            query: () => "/settings/visible-languages/management",
            providesTags: ["SETTINGS"],
        }),

        updateSettingsVisibleLanguages: builder.mutation<
            VisibleLanguageManagement[],
            UpdateVisibleLanguagesDto
        >({
            query: (body) => ({
                url: "/settings/visible-languages",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["SETTINGS"],
        }),

        // ==================================================
        // WORD TO LANGUAGES
        // ==================================================
        getSettingsWordToLanguagesVersion: builder.query<WordToLanguagesVersion, void>({
            query: () => "/settings/word-to-languages/version",
            providesTags: ["SETTINGS"],
        }),

        getSettingsWordToLanguagesList: builder.query<
            WordToLanguagesListResponse,
            void
        >({
            query: () => "/settings/word-to-languages/list",
            providesTags: ["SETTINGS"],
        }),
    }),
});

export const {
    useGetSettingsCurrentSeasonIdQuery,
    useUpdateSettingsSeasonMutation,

    useGetSettingsVisibleAccountTypesQuery,
    useGetSettingsVisibleAccountTypesManagementQuery,
    useUpdateSettingsVisibleAccountTypesMutation,

    useGetSettingsDarkModeQuery,
    useUpdateSettingsDarkModeMutation,

    useGetSettingsLanguageQuery,
    useUpdateSettingsLanguageMutation,

    useGetSettingsVisibleLanguagesQuery,
    useGetSettingsVisibleLanguagesManagementQuery,
    useUpdateSettingsVisibleLanguagesMutation,

    useGetSettingsWordToLanguagesVersionQuery,
    useGetSettingsWordToLanguagesListQuery,
} = settingsApi;