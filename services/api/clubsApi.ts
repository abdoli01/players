// services/clubsApi.ts
import { baseApi } from "./baseApi";
import {
    Club,
    CreateClubDto,
    UpdateClubDto,
    ClubSearchParams,
} from "@/types/club";

export const clubsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /clubs
        createClub: builder.mutation<Club, CreateClubDto>({
            query: (body) => ({
                url: "/clubs",
                method: "POST",
                body,
            }),
            invalidatesTags: ["CLUBS"],
        }),

        // GET /clubs
        getClubs: builder.query<Club[], void>({
            query: () => "/clubs",
            providesTags: ["CLUBS"],
        }),

        // GET /clubs/search
        searchClubs: builder.query<Club[], ClubSearchParams>({
            query: (params) => ({
                url: "/clubs/search",
                params,
            }),
            providesTags: ["CLUBS"],
        }),

        // GET /clubs/{id}
        getClubById: builder.query<Club, string>({
            query: (id) => `/clubs/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "CLUBS", id },
            ],
        }),

        // PATCH /clubs/{id}
        updateClub: builder.mutation<
            Club,
            { id: string; body: UpdateClubDto }
        >({
            query: ({ id, body }) => ({
                url: `/clubs/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["CLUBS"],
        }),

        // DELETE /clubs/{id}
        deleteClub: builder.mutation<void, string>({
            query: (id) => ({
                url: `/clubs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CLUBS"],
        }),

    }),
});

export const {
    useCreateClubMutation,
    useGetClubsQuery,
    useSearchClubsQuery,
    useGetClubByIdQuery,
    useUpdateClubMutation,
    useDeleteClubMutation,
} = clubsApi;
