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
} from "@/types/settings";

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // =======================
        // SEASON
        // =======================
        getCurrentSeasonId: builder.query<CurrentSeasonId, void>({
            query: () => "/settings/current-season-id",
            providesTags: ["SETTINGS"],
        }),

        updateSeason: builder.mutation<void, UpdateSeasonDto>({
            query: (body) => ({
                url: "/settings/season",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["SETTINGS"],
        }),

        // =======================
        // ACCOUNT TYPES
        // =======================
        getVisibleAccountTypes: builder.query<VisibleAccountType[], void>({
            query: () => "/settings/visible-account-types",
            providesTags: ["SETTINGS"],
        }),

        getVisibleAccountTypesManagement: builder.query<
            VisibleAccountTypeManagement[],
            void
        >({
            query: () => "/settings/visible-account-types/management",
            providesTags: ["SETTINGS"],
        }),

        updateVisibleAccountTypes: builder.mutation<
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

        // =======================
        // DARK MODE
        // =======================
        getDarkMode: builder.query<DarkModeResponse, void>({
            query: () => "/settings/dark-mode",
            providesTags: ["SETTINGS"],
        }),

        updateDarkMode: builder.mutation<void, UpdateDarkModeDto>({
            query: (body) => ({
                url: "/settings/dark-mode",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["SETTINGS"],
        }),

        // =======================
        // LANGUAGE
        // =======================
        getLanguage: builder.query<LanguageResponse, void>({
            query: () => "/settings/language",
            providesTags: ["SETTINGS"],
        }),

        updateLanguage: builder.mutation<void, UpdateLanguageDto>({
            query: (body) => ({
                url: "/settings/language",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["SETTINGS"],
        }),

        // =======================
        // LANGUAGES LIST
        // =======================
        getVisibleLanguages: builder.query<VisibleLanguage[], void>({
            query: () => "/settings/visible-languages",
            providesTags: ["SETTINGS"],
        }),

        getVisibleLanguagesManagement: builder.query<
            VisibleLanguageManagement[],
            void
        >({
            query: () => "/settings/visible-languages/management",
            providesTags: ["SETTINGS"],
        }),

        updateVisibleLanguages: builder.mutation<
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

        // =======================
        // WORD TO LANGUAGES
        // =======================
        getWordToLanguagesVersion: builder.query<WordToLanguagesVersion, void>({
            query: () => "/settings/word-to-languages/version",
            providesTags: ["SETTINGS"],
        }),

        getWordToLanguagesList: builder.query<
            WordToLanguagesListResponse,
            void
        >({
            query: () => "/settings/word-to-languages/list",
            providesTags: ["SETTINGS"],
        }),

    }),
});

export const {
    useGetCurrentSeasonIdQuery,
    useUpdateSeasonMutation,

    useGetVisibleAccountTypesQuery,
    useGetVisibleAccountTypesManagementQuery,
    useUpdateVisibleAccountTypesMutation,

    useGetDarkModeQuery,
    useUpdateDarkModeMutation,

    useGetLanguageQuery,
    useUpdateLanguageMutation,

    useGetVisibleLanguagesQuery,
    useGetVisibleLanguagesManagementQuery,
    useUpdateVisibleLanguagesMutation,

    useGetWordToLanguagesVersionQuery,
    useGetWordToLanguagesListQuery,
} = settingsApi;