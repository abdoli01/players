// services/api/languagesApi.ts

import { baseApi } from "./baseApi";
import {
    Language,
    CreateLanguageDto,
    UpdateLanguageDto,
    LanguageSearchParams,
} from "@/types/language";

export const languagesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /languages
        createLanguage: builder.mutation<Language, CreateLanguageDto>({
            query: (body) => ({
                url: "/languages",
                method: "POST",
                body,
            }),
            invalidatesTags: ["LANGUAGES"],
        }),

        // GET /languages
        getLanguages: builder.query<Language[], void>({
            query: () => "/languages",
            providesTags: ["LANGUAGES"],
        }),

        // GET /languages/search
        searchLanguages: builder.query<
            Language[],
            LanguageSearchParams
        >({
            query: (params) => ({
                url: "/languages/search",
                params,
            }),
            providesTags: ["LANGUAGES"],
        }),

        // GET /languages/{id}
        getLanguageById: builder.query<Language, string>({
            query: (id) => `/languages/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "LANGUAGES", id },
            ],
        }),

        // PATCH /languages/{id}
        updateLanguage: builder.mutation<
            Language,
            { id: string; body: UpdateLanguageDto }
        >({
            query: ({ id, body }) => ({
                url: `/languages/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["LANGUAGES"],
        }),

        // DELETE /languages/{id}
        deleteLanguage: builder.mutation<void, string>({
            query: (id) => ({
                url: `/languages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["LANGUAGES"],
        }),
    }),
});

export const {
    useCreateLanguageMutation,
    useGetLanguagesQuery,
    useSearchLanguagesQuery,
    useGetLanguageByIdQuery,
    useUpdateLanguageMutation,
    useDeleteLanguageMutation,
} = languagesApi;