
// services/usersApi.ts
import { baseApi } from "./baseApi";
import { User } from "@/types/user";
import { UserSearchParams,SetPlayerIdDto, AdminSetPlayerIdDto } from "@/types/user";

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

        // services/usersApi.ts
        updateUser: builder.mutation<
            User,
            { id: string; body: Partial<User> }
        >({
            query: ({ id, body }) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["USERS"],
        }),

        // ----------------------------
        // POST /users/set-player-id
        // فقط برای PLAYER که playerId هنوز null باشد
        // ----------------------------
        setPlayerId: builder.mutation<void, SetPlayerIdDto>({
            query: (body) => ({
                url: "/users/set-player-id",
                method: "POST",
                body,
            }),
            invalidatesTags: ["USERS"],
        }),

        // ----------------------------
        // POST /users/admin/set-player-id
        // Admin می‌تواند هر بار تغییر دهد
        // ----------------------------
        adminSetPlayerId: builder.mutation<void, AdminSetPlayerIdDto>({
            query: (body) => ({
                url: "/users/admin/set-player-id",
                method: "POST",
                body,
            }),
            invalidatesTags: ["USERS"],
        }),

    }),
});
export const {
    useGetUsersQuery,
    useSearchUsersQuery,
    useUpdateUserMutation,
    useSetPlayerIdMutation,       // <-- اضافه شد
    useAdminSetPlayerIdMutation,  // <-- اضافه شد
} = usersApi;

