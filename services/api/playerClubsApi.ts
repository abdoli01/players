// services/playerClubsApi.ts
import { baseApi } from "./baseApi";
import {
    PlayerClub,
    CreatePlayerClubDto,
    UpdatePlayerClubDto,
    PlayerClubSearchParams,
} from "@/types/playerClub";

export const playerClubsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ایجاد رابطه بازیکن-باشگاه
        createPlayerClub: builder.mutation<PlayerClub, CreatePlayerClubDto>({
            query: (body) => ({
                url: "/player-clubs",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PLAYER_CLUBS"],
        }),

        // دریافت همه روابط بازیکن-باشگاه
        getPlayerClubs: builder.query<PlayerClub[], void>({
            query: () => "/player-clubs",
            providesTags: ["PLAYER_CLUBS"],
        }),

        // جستجو و فیلتر روابط
        searchPlayerClubs: builder.query<PlayerClub[], PlayerClubSearchParams>({
            query: (params) => ({
                url: "/player-clubs/search",
                params,
            }),
            providesTags: ["PLAYER_CLUBS"],
        }),

        // دریافت یک رابطه بر اساس id
        getPlayerClubById: builder.query<PlayerClub, string>({
            query: (id) => `/player-clubs/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "PLAYER_CLUBS", id },
            ],
        }),

        // بروزرسانی رابطه
        updatePlayerClub: builder.mutation<
            PlayerClub,
            { id: string; body: UpdatePlayerClubDto }
        >({
            query: ({ id, body }) => ({
                url: `/player-clubs/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["PLAYER_CLUBS"],
        }),

        // حذف رابطه
        deletePlayerClub: builder.mutation<void, string>({
            query: (id) => ({
                url: `/player-clubs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PLAYER_CLUBS"],
        }),

    }),
});

export const {
    useCreatePlayerClubMutation,
    useGetPlayerClubsQuery,
    useSearchPlayerClubsQuery,
    useGetPlayerClubByIdQuery,
    useUpdatePlayerClubMutation,
    useDeletePlayerClubMutation,
} = playerClubsApi;
