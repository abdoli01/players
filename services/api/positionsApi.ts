import { baseApi } from "./baseApi";
import {
    Position,
    CreatePositionDto,
    UpdatePositionDto,
    PositionSearchParams,
} from "@/types/position";

export const positionsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /positions
        createPosition: builder.mutation<Position, CreatePositionDto>({
            query: (body) => ({
                url: "/positions",
                method: "POST",
                body,
            }),
            invalidatesTags: ["POSITIONS"],
        }),

        // GET /positions
        getPositions: builder.query<Position[], void>({
            query: () => "/positions",
            providesTags: ["POSITIONS"],
        }),

        // GET /positions/search
        searchPositions: builder.query<Position[], PositionSearchParams>({
            query: (params) => ({
                url: "/positions/search",
                params,
            }),
            providesTags: ["POSITIONS"],
        }),

        // GET /positions/{id}
        getPositionById: builder.query<Position, string>({
            query: (id) => `/positions/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "POSITIONS", id },
            ],
        }),

        // PATCH /positions/{id}
        updatePosition: builder.mutation<
            Position,
            { id: string; body: UpdatePositionDto }
        >({
            query: ({ id, body }) => ({
                url: `/positions/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["POSITIONS"],
        }),

        // DELETE /positions/{id}
        deletePosition: builder.mutation<void, string>({
            query: (id) => ({
                url: `/positions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["POSITIONS"],
        }),
    }),
});

export const {
    useCreatePositionMutation,
    useGetPositionsQuery,
    useSearchPositionsQuery,
    useGetPositionByIdQuery,
    useUpdatePositionMutation,
    useDeletePositionMutation,
} = positionsApi;