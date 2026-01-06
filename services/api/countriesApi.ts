// services/api/countriesApi.ts
import { baseApi } from "./baseApi";
import {
    Country,
    CreateCountryDto,
    UpdateCountryDto,
    CountrySearchParams,
} from "@/types/country";

export const countriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /countries
        createCountry: builder.mutation<Country, CreateCountryDto>({
            query: (body) => ({
                url: "/countries",
                method: "POST",
                body,
            }),
            invalidatesTags: ["COUNTRIES"],
        }),

        // GET /countries
        getCountries: builder.query<Country[], void>({
            query: () => "/countries",
            providesTags: ["COUNTRIES"],
        }),

        // GET /countries/search
        searchCountries: builder.query<
            Country[],
            CountrySearchParams
        >({
            query: (params) => ({
                url: "/countries/search",
                params,
            }),
            providesTags: ["COUNTRIES"],
        }),

        // GET /countries/{id}
        getCountryById: builder.query<Country, string>({
            query: (id) => `/countries/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "COUNTRIES", id },
            ],
        }),

        // PATCH /countries/{id}
        updateCountry: builder.mutation<
            Country,
            { id: string; body: UpdateCountryDto }
        >({
            query: ({ id, body }) => ({
                url: `/countries/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["COUNTRIES"],
        }),

        // DELETE /countries/{id}
        deleteCountry: builder.mutation<void, string>({
            query: (id) => ({
                url: `/countries/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["COUNTRIES"],
        }),

    }),
});

export const {
    useCreateCountryMutation,
    useGetCountriesQuery,
    useSearchCountriesQuery,
    useGetCountryByIdQuery,
    useUpdateCountryMutation,
    useDeleteCountryMutation,
} = countriesApi;
