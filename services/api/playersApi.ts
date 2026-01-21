// services/playersApi.ts
import { baseApi } from "./baseApi";
import {
    Player,
    CreatePlayerDto,
    UpdatePlayerDto,
    PlayerSearchParams,
} from "@/types/player";

export const playersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /players
        createPlayer: builder.mutation<Player, CreatePlayerDto>({
            query: (body) => ({
                url: "/players",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PLAYERS"],
        }),

        // GET /players
        getPlayers: builder.query<Player[], void>({
            query: () => "/players",
            providesTags: ["PLAYERS"],
        }),

        // GET /players/search
        searchPlayers: builder.query<Player[], PlayerSearchParams>({
            query: (params) => ({
                url: "/players/search",
                params,
            }),
            providesTags: ["PLAYERS"],
        }),

        // GET /players/{id}
        getPlayerById: builder.query<Player, string>({
            query: (id) => `/players/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "PLAYERS", id },
            ],
        }),

        // PATCH /players/{id}
        updatePlayer: builder.mutation<
            Player,
            { id: string; body: UpdatePlayerDto }
        >({
            query: ({ id, body }) => ({
                url: `/players/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["PLAYERS"],
        }),

        // DELETE /players/{id}
        deletePlayer: builder.mutation<void, string>({
            query: (id) => ({
                url: `/players/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PLAYERS"],
        }),



    }),
});

export const {
    useCreatePlayerMutation,
    useGetPlayersQuery,
    useSearchPlayersQuery,
    useGetPlayerByIdQuery,
    useUpdatePlayerMutation,
    useDeletePlayerMutation,
} = playersApi;
