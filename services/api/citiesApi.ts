// services/api/citiesApi.ts
import { baseApi } from "./baseApi";
import {
    City,
    CreateCityDto,
    UpdateCityDto,
    CitySearchParams,
} from "@/types/city";

export const citiesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /cities
        createCity: builder.mutation<City, CreateCityDto>({
            query: (body) => ({
                url: "/cities",
                method: "POST",
                body,
            }),
            invalidatesTags: ["CITIES"],
        }),

        // GET /cities
        getCities: builder.query<City[], void>({
            query: () => "/cities",
            providesTags: ["CITIES"],
        }),

        // GET /cities/search
        searchCities: builder.query<
            City[],
            CitySearchParams
        >({
            query: (params) => ({
                url: "/cities/search",
                params,
            }),
            providesTags: ["CITIES"],
        }),

        // GET /cities/{id}
        getCityById: builder.query<City, string>({
            query: (id) => `/cities/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "CITIES", id },
            ],
        }),

        // PATCH /cities/{id}
        updateCity: builder.mutation<
            City,
            { id: string; body: UpdateCityDto }
        >({
            query: ({ id, body }) => ({
                url: `/cities/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["CITIES"],
        }),

        // DELETE /cities/{id}
        deleteCity: builder.mutation<void, string>({
            query: (id) => ({
                url: `/cities/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CITIES"],
        }),

    }),
});

export const {
    useCreateCityMutation,
    useGetCitiesQuery,
    useSearchCitiesQuery,
    useGetCityByIdQuery,
    useUpdateCityMutation,
    useDeleteCityMutation,
} = citiesApi;
