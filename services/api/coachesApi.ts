import { baseApi } from "./baseApi";
import {
    Coach,
    CreateCoachDto,
    UpdateCoachDto,
    CoachSearchParams,
} from "@/types/coach";

export const coachesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /coaches
        createCoach: builder.mutation<Coach, CreateCoachDto>({
            query: (body) => ({
                url: "/coaches",
                method: "POST",
                body,
            }),
            invalidatesTags: ["COACHES"],
        }),

        // GET /coaches
        getCoaches: builder.query<Coach[], void>({
            query: () => "/coaches",
            providesTags: ["COACHES"],
        }),

        // GET /coaches/search
        searchCoaches: builder.query<Coach[], CoachSearchParams>({
            query: (params) => ({
                url: "/coaches/search",
                params,
            }),
            providesTags: ["COACHES"],
        }),

        // GET /coaches/{id}
        getCoachById: builder.query<Coach, string>({
            query: (id) => `/coaches/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "COACHES", id },
            ],
        }),

        // PATCH /coaches/{id}
        updateCoach: builder.mutation<
            Coach,
            { id: string; body: UpdateCoachDto }
        >({
            query: ({ id, body }) => ({
                url: `/coaches/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["COACHES"],
        }),

        // DELETE /coaches/{id}
        deleteCoach: builder.mutation<void, string>({
            query: (id) => ({
                url: `/coaches/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["COACHES"],
        }),

    }),
});

export const {
    useCreateCoachMutation,
    useGetCoachesQuery,
    useSearchCoachesQuery,
    useGetCoachByIdQuery,
    useUpdateCoachMutation,
    useDeleteCoachMutation,
} = coachesApi;