// services/profileApi.ts
import { baseApi } from "./baseApi";
import {
    ProfileKeyDto,
    ProfileResponseDto,
    GetProfileKeywordsParams,
    GetProfileParams,
} from "@/types/profile";

export const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ----------------------------------
        // GET /profile/keyword
        // دریافت لیست کلیدواژه‌های پروفایل
        // ----------------------------------
        getProfileKeywords: builder.query<
            ProfileKeyDto[],
            GetProfileKeywordsParams
        >({
            query: (params) => ({
                url: "/page-profile/keyword",
                params,
            }),
            providesTags: ["PROFILE"],
        }),

        // ----------------------------------
        // GET /profile
        // دریافت اطلاعات پروفایل
        // ----------------------------------
        getProfile: builder.query<
            ProfileResponseDto,
            GetProfileParams
        >({
            query: (params) => ({
                url: "/page-profile",
                params,
            }),
            providesTags: ["PROFILE"],
        }),

    }),
});

export const {
    useGetProfileKeywordsQuery,
    useGetProfileQuery,
} = profileApi;
