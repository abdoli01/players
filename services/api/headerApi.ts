// services/api/headerApi.ts
import { baseApi } from "./baseApi";
import { HeaderPlayerResponseDto } from "@/types/header";

export const headerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPlayerHeader: builder.query<
            HeaderPlayerResponseDto,
            { playerId: string; seasonId: string; keyword: string }
        >({
            query: ({ playerId, seasonId, keyword }) => ({
                url: "/page-header",
                params: {
                    keyword,
                    playerId,
                    seasonId,
                },
            }),
            providesTags: ["HEADER"],
        }),
    }),
});

export const { useGetPlayerHeaderQuery } = headerApi;
