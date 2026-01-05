import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


export const baseApi = createApi({
    reducerPath: "api", // نام reducer برای RTK Query
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("access_token");
                if (token) headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["POSTS", "USERS","PLAYERS","PACKAGES","SEASONS","CLUBS"], // برای invalidation
    endpoints: () => ({}), // فقط baseApi خودش خالیه
});
