// services/api/provincesApi.ts
import { baseApi } from "./baseApi";
import {
    Province,
    CreateProvinceDto,
    UpdateProvinceDto,
    ProvinceSearchParams,
} from "@/types/province";

export const provincesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /provinces
        createProvince: builder.mutation<Province, CreateProvinceDto>({
            query: (body) => ({
                url: "/provinces",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PROVINCES"],
        }),

        // GET /provinces
        getProvinces: builder.query<Province[], void>({
            query: () => "/provinces",
            providesTags: ["PROVINCES"],
        }),

        // GET /provinces/search
        searchProvinces: builder.query<
            Province[],
            ProvinceSearchParams
        >({
            query: (params) => ({
                url: "/provinces/search",
                params,
            }),
            providesTags: ["PROVINCES"],
        }),

        // GET /provinces/{id}
        getProvinceById: builder.query<Province, string>({
            query: (id) => `/provinces/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "PROVINCES", id },
            ],
        }),

        // PATCH /provinces/{id}
        updateProvince: builder.mutation<
            Province,
            { id: string; body: UpdateProvinceDto }
        >({
            query: ({ id, body }) => ({
                url: `/provinces/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["PROVINCES"],
        }),

        // DELETE /provinces/{id}
        deleteProvince: builder.mutation<void, string>({
            query: (id) => ({
                url: `/provinces/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PROVINCES"],
        }),

    }),
});

export const {
    useCreateProvinceMutation,
    useGetProvincesQuery,
    useSearchProvincesQuery,
    useGetProvinceByIdQuery,
    useUpdateProvinceMutation,
    useDeleteProvinceMutation,
} = provincesApi;
