
// services/usersApi.ts
import { baseApi } from "./baseApi";
import { User } from "@/types/user";
import { UserSearchParams,SetPlayerIdDto, AdminSetPlayerIdDto, ChangePasswordDto, UpdateProfileDto,AdminChangePasswordDto,SetUserColorPaletteDto } from "@/types/user";

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

        editProfile: builder.mutation<User, UpdateProfileDto>({
            query: (body) => ({
                url: "/users",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["USERS"], // اختیاری: پاک کردن cache کاربران
        }),

        changePassword: builder.mutation<void, ChangePasswordDto>({
            query: (body) => ({
                url: "/users/change-password",
                method: "PATCH",
                body,
            }),
        }),

        // ----------------------------
        // PATCH /users/admin/change-password
        // تغییر رمز عبور کاربر توسط Admin
        // ----------------------------
        adminChangePassword: builder.mutation<void, AdminChangePasswordDto>({
            query: (body) => ({
                url: "/users/admin/change-password",
                method: "PATCH",
                body,
            }),
        }),

                    // ----------------------------
            // GET /users/me/color-palette
            // دریافت پالت رنگی کاربر جاری
            // ----------------------------
        getMyColorPalette: builder.query<any, void>({
            query: () => "/users/me/color-palette",
            providesTags: ["USERS"],
        }),

            // ----------------------------
            // PATCH /users/{id}/color-palette
            // تغییر پالت رنگی کاربر توسط ادمین
            // ----------------------------
        updateUserColorPalette: builder.mutation<
            void,
            { id: string; body: SetUserColorPaletteDto }
        >({
            query: ({ id, body }) => ({
                url: `/users/${id}/color-palette`,
                method: "PATCH",
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
    useSetPlayerIdMutation,
    useAdminSetPlayerIdMutation,
    useEditProfileMutation,      // ← اضافه شد
    useChangePasswordMutation,   // ← اضافه شد
    useAdminChangePasswordMutation,
    useGetMyColorPaletteQuery,
    useUpdateUserColorPaletteMutation,
} = usersApi;
