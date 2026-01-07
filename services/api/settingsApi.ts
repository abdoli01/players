// services/settingsApi.ts
import { baseApi } from "./baseApi"; // فرض می‌کنیم baseApi مشابه playersApi هست
import { Settings, UpdateSettingsDto } from "@/types/settings";

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET /settings/current-season-id
        getCurrentSeasonId: builder.query<string, void>({
            query: () => "/settings/current-season-id",
            providesTags: ["SETTINGS"],
        }),

        // GET /settings
        getSettings: builder.query<Settings, void>({
            query: () => "/settings",
            providesTags: ["SETTINGS"],
        }),

        // PATCH /settings
        updateSettings: builder.mutation<Settings, UpdateSettingsDto>({
            query: (body) => ({
                url: "/settings",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["SETTINGS"],
        }),

    }),
});

export const {
    useGetCurrentSeasonIdQuery,
    useGetSettingsQuery,
    useUpdateSettingsMutation,
} = settingsApi;
