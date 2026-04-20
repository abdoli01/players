import { baseApi } from "./baseApi";
import {
    MatchTransaction,
    CreateMatchTransactionDto,
    UpdateMatchTransactionDto,
    MatchTransactionSearchParams,
} from "@/types/matchTransaction";

export const matchTransactionsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /match-transactions
        createMatchTransaction: builder.mutation<
            MatchTransaction,
            CreateMatchTransactionDto
        >({
            query: (body) => ({
                url: "/match-transactions",
                method: "POST",
                body,
            }),
            invalidatesTags: ["MATCH_TRANSACTIONS"],
        }),

        // GET /match-transactions
        getMatchTransactions: builder.query<MatchTransaction[], void>({
            query: () => "/match-transactions",
            providesTags: ["MATCH_TRANSACTIONS"],
        }),

        // GET /match-transactions/search
        searchMatchTransactions: builder.query<
            MatchTransaction[],
            MatchTransactionSearchParams
        >({
            query: (params) => ({
                url: "/match-transactions/search",
                params,
            }),
            providesTags: ["MATCH_TRANSACTIONS"],
        }),

        // GET /match-transactions/{id}
        getMatchTransactionById: builder.query<MatchTransaction, string>({
            query: (id) => `/match-transactions/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "MATCH_TRANSACTIONS", id },
            ],
        }),

        // PATCH /match-transactions/{id}
        updateMatchTransaction: builder.mutation<
            MatchTransaction,
            { id: string; body: UpdateMatchTransactionDto }
        >({
            query: ({ id, body }) => ({
                url: `/match-transactions/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["MATCH_TRANSACTIONS"],
        }),

        // DELETE /match-transactions/{id}
        deleteMatchTransaction: builder.mutation<void, string>({
            query: (id) => ({
                url: `/match-transactions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MATCH_TRANSACTIONS"],
        }),
    }),
});

export const {
    useCreateMatchTransactionMutation,
    useGetMatchTransactionsQuery,
    useSearchMatchTransactionsQuery,
    useGetMatchTransactionByIdQuery,
    useUpdateMatchTransactionMutation,
    useDeleteMatchTransactionMutation,
} = matchTransactionsApi;