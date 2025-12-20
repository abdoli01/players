import { baseApi } from "./baseApi";

export interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

export const postsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query<Post[], void>({
            query: () => "/posts",
            providesTags: ["POSTS"], // وقتی داده‌ها رو کش می‌کنه
        }),
        createPost: builder.mutation({
            query: (body) => ({
                url: "/posts",
                method: "POST",
                body,
            }),
            invalidatesTags: ["POSTS"], // بعد از ایجاد پست، کش رو invalidate می‌کنه
        }),
    }),
});

export const { useGetPostsQuery, useCreatePostMutation } = postsApi;
