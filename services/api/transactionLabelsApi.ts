import { baseApi } from "./baseApi";
import {
    TransactionLabel,
    CreateTransactionLabelDto,
    UpdateTransactionLabelDto,
} from "@/types/transactionLabel";

export const transactionLabelsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /transaction-labels
        createTransactionLabel: builder.mutation<
            TransactionLabel,
            CreateTransactionLabelDto
        >({
            query: (body) => ({
                url: "/transaction-labels",
                method: "POST",
                body,
            }),
            invalidatesTags: ["TRANSACTION_LABELS"],
        }),

        // GET /transaction-labels
        getTransactionLabels: builder.query<TransactionLabel[], void>({
            query: () => "/transaction-labels",
            providesTags: ["TRANSACTION_LABELS"],
        }),

        // GET /transaction-labels/{id}
        getTransactionLabelById: builder.query<
            TransactionLabel,
            string
        >({
            query: (id) => `/transaction-labels/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "TRANSACTION_LABELS", id },
            ],
        }),

        // PATCH /transaction-labels/{id}
        updateTransactionLabel: builder.mutation<
            TransactionLabel,
            {
                id: string;
                body: UpdateTransactionLabelDto;
            }
        >({
            query: ({ id, body }) => ({
                url: `/transaction-labels/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["TRANSACTION_LABELS"],
        }),

        // DELETE /transaction-labels/{id}
        deleteTransactionLabel: builder.mutation<void, string>({
            query: (id) => ({
                url: `/transaction-labels/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TRANSACTION_LABELS"],
        }),
    }),
});

export const {
    useCreateTransactionLabelMutation,
    useGetTransactionLabelsQuery,
    useGetTransactionLabelByIdQuery,
    useUpdateTransactionLabelMutation,
    useDeleteTransactionLabelMutation,
} = transactionLabelsApi;