// services/api/continentsApi.ts
import { baseApi } from "./baseApi";
import {
    Continent,
    CreateContinentDto,
    UpdateContinentDto,
    ContinentSearchParams,
} from "@/types/continent";

export const continentsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /continents
        createContinent: builder.mutation<Continent, CreateContinentDto>({
            query: (body) => ({
                url: "/continents",
                method: "POST",
                body,
            }),
            invalidatesTags: ["CONTINENTS"],
        }),

        // GET /continents
        getContinents: builder.query<Continent[], void>({
            query: () => "/continents",
            providesTags: ["CONTINENTS"],
        }),

        // GET /continents/search
        searchContinents: builder.query<
            Continent[],
            ContinentSearchParams
        >({
            query: (params) => ({
                url: "/continents/search",
                params,
            }),
            providesTags: ["CONTINENTS"],
        }),

        // GET /continents/{id}
        getContinentById: builder.query<Continent, string>({
            query: (id) => `/continents/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "CONTINENTS", id },
            ],
        }),

        // PATCH /continents/{id}
        updateContinent: builder.mutation<
            Continent,
            { id: string; body: UpdateContinentDto }
        >({
            query: ({ id, body }) => ({
                url: `/continents/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["CONTINENTS"],
        }),

        // DELETE /continents/{id}
        deleteContinent: builder.mutation<void, string>({
            query: (id) => ({
                url: `/continents/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CONTINENTS"],
        }),

    }),
});

export const {
    useCreateContinentMutation,
    useGetContinentsQuery,
    useSearchContinentsQuery,
    useGetContinentByIdQuery,
    useUpdateContinentMutation,
    useDeleteContinentMutation,
} = continentsApi;
