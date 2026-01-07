// services/headerApi.ts
import { baseApi } from "./baseApi";
import { HeaderParams, HeaderResponse } from "@/types/header";

export const headerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getHeader: builder.query<HeaderResponse, HeaderParams>({
            query: (params) => ({
                url: "/header",
                params,
            }),
            providesTags: ["HEADER"],
        }),

    }),
});

export const { useGetHeaderQuery } = headerApi;
