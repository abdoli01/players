
// services/usersApi.ts
import { baseApi } from "./baseApi";
import { User } from "@/types/user";
import { UserSearchParams } from "@/types/user";

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET /users
        getUsers: builder.query<User[], void>({
            query: () => "/users",
            providesTags: ["USERS"],
        }),

        // GET /users/search
        searchUsers: builder.query<User[], UserSearchParams>({
            query: (params) => ({
                url: "/users/search",
                params,
            }),
            providesTags: ["USERS"],
        }),
    }),
});
export const {
    useGetUsersQuery,
    useSearchUsersQuery,
} = usersApi;

