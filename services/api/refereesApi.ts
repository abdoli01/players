import { baseApi } from "./baseApi";
import {
    Referee,
    CreateRefereeDto,
    UpdateRefereeDto,
    RefereeSearchParams,
} from "@/types/referee";

export const refereesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ایجاد داور
        createReferee: builder.mutation<Referee, CreateRefereeDto>({
            query: (body) => ({
                url: "/referees",
                method: "POST",
                body,
            }),
            invalidatesTags: ["REFEREES"],
        }),

        // دریافت لیست داوران
        getReferees: builder.query<Referee[], void>({
            query: () => "/referees",
            providesTags: ["REFEREES"],
        }),

        // جستجو داوران
        searchReferees: builder.query<Referee[], RefereeSearchParams>({
            query: (params) => ({
                url: "/referees/search",
                params,
            }),
            providesTags: ["REFEREES"],
        }),

        // دریافت داور با id
        getRefereeById: builder.query<Referee, string>({
            query: (id) => `/referees/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "REFEREES", id },
            ],
        }),

        // ویرایش داور
        updateReferee: builder.mutation<
            Referee,
            { id: string; body: UpdateRefereeDto }
        >({
            query: ({ id, body }) => ({
                url: `/referees/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["REFEREES"],
        }),

        // حذف داور
        deleteReferee: builder.mutation<void, string>({
            query: (id) => ({
                url: `/referees/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["REFEREES"],
        }),
    }),
});

export const {
    useCreateRefereeMutation,
    useGetRefereesQuery,
    useSearchRefereesQuery,
    useGetRefereeByIdQuery,
    useUpdateRefereeMutation,
    useDeleteRefereeMutation,
} = refereesApi;