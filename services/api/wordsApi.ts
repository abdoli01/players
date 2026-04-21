// services/api/wordsApi.ts

import { baseApi } from "./baseApi";
import {
    Word,
    CreateWordDto,
    UpdateWordDto,
    WordSearchParams,
} from "@/types/word";

export const wordsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /words
        createWord: builder.mutation<Word, CreateWordDto>({
            query: (body) => ({
                url: "/words",
                method: "POST",
                body,
            }),
            invalidatesTags: ["WORDS"],
        }),

        // GET /words
        getWords: builder.query<Word[], void>({
            query: () => "/words",
            providesTags: ["WORDS"],
        }),

        // GET /words/search
        searchWords: builder.query<Word[], WordSearchParams>({
            query: (params) => ({
                url: "/words/search",
                params,
            }),
            providesTags: ["WORDS"],
        }),

        // GET /words/{id}
        getWordById: builder.query<Word, string>({
            query: (id) => `/words/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "WORDS", id },
            ],
        }),

        // PATCH /words/{id}
        updateWord: builder.mutation<
            Word,
            { id: string; body: UpdateWordDto }
        >({
            query: ({ id, body }) => ({
                url: `/words/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["WORDS"],
        }),

        // DELETE /words/{id}
        deleteWord: builder.mutation<void, string>({
            query: (id) => ({
                url: `/words/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["WORDS"],
        }),
    }),
});

export const {
    useCreateWordMutation,
    useGetWordsQuery,
    useSearchWordsQuery,
    useGetWordByIdQuery,
    useUpdateWordMutation,
    useDeleteWordMutation,
} = wordsApi;