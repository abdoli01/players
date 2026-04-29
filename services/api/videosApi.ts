import { baseApi } from "./baseApi";
import {
    VideoKey,
    VideosReportItemsResponse,
    VideosResponse,
    GetVideoKeywordsParams,
    GetVideoItemsParams,
    GetVideosParams,
} from "@/types/video";

export const videosApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // -----------------------
        // GET /page-videos/keyword
        // -----------------------
        getVideoKeywords: builder.query<VideoKey[], GetVideoKeywordsParams>({
            query: (params) => ({
                url: "/page-videos/keyword",
                params,
            }),
            providesTags: ["VIDEOS"],
        }),

        // -----------------------
        // GET /page-videos/items
        // -----------------------
        getVideoItems: builder.query<
            VideosReportItemsResponse,
            GetVideoItemsParams
        >({
            query: (params) => ({
                url: "/page-videos/items",
                params,
            }),
            providesTags: ["VIDEOS"],
        }),

        // -----------------------
        // GET /page-videos
        // -----------------------
        getVideos: builder.query<VideosResponse, GetVideosParams>({
            query: (params) => ({
                url: "/page-videos",
                params: {
                    ...params,
                    // 👇 مهم برای array
                    items: params.items,
                },
            }),
            providesTags: ["VIDEOS"],
        }),

    }),
});

export const {
    useGetVideoKeywordsQuery,
    useGetVideoItemsQuery,
    useGetVideosQuery,
    useLazyGetVideosQuery
} = videosApi;