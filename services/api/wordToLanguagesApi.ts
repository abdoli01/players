// services/api/wordToLanguagesApi.ts

import { baseApi } from "./baseApi";
import {
    WordToLanguage,
    CreateWordToLanguageDto,
    UpdateWordToLanguageDto,
    WordToLanguageSearchParams,
} from "@/types/wordToLanguage";

export const wordToLanguagesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /word-to-languages
        createWordToLanguage: builder.mutation<
            WordToLanguage,
            CreateWordToLanguageDto
        >({
            query: (body) => ({
                url: "/word-to-languages",
                method: "POST",
                body,
            }),
            invalidatesTags: ["WORD_TO_LANGUAGES"],
        }),

        // GET /word-to-languages
        getWordToLanguages: builder.query<WordToLanguage[], void>({
            query: () => "/word-to-languages",
            providesTags: ["WORD_TO_LANGUAGES"],
        }),

        // GET /word-to-languages/search
        searchWordToLanguages: builder.query<
            WordToLanguage[],
            WordToLanguageSearchParams
        >({
            query: (params) => ({
                url: "/word-to-languages/search",
                params,
            }),
            providesTags: ["WORD_TO_LANGUAGES"],
        }),

        // GET /word-to-languages/{id}
        getWordToLanguageById: builder.query<WordToLanguage, string>({
            query: (id) => `/word-to-languages/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "WORD_TO_LANGUAGES", id },
            ],
        }),

        // PATCH /word-to-languages/{id}
        updateWordToLanguage: builder.mutation<
            WordToLanguage,
            { id: string; body: UpdateWordToLanguageDto }
        >({
            query: ({ id, body }) => ({
                url: `/word-to-languages/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["WORD_TO_LANGUAGES"],
        }),

        // DELETE /word-to-languages/{id}
        deleteWordToLanguage: builder.mutation<void, string>({
            query: (id) => ({
                url: `/word-to-languages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["WORD_TO_LANGUAGES"],
        }),
    }),
});

export const {
    useCreateWordToLanguageMutation,
    useGetWordToLanguagesQuery,
    useSearchWordToLanguagesQuery,
    useGetWordToLanguageByIdQuery,
    useUpdateWordToLanguageMutation,
    useDeleteWordToLanguageMutation,
} = wordToLanguagesApi;