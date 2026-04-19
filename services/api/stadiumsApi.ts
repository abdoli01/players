import { baseApi } from "./baseApi";
import {
    Stadium,
    CreateStadiumDto,
    UpdateStadiumDto,
} from "@/types/stadium";

export const stadiumsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ایجاد ورزشگاه
        createStadium: builder.mutation<Stadium, CreateStadiumDto>({
            query: (body) => ({
                url: "/stadiums",
                method: "POST",
                body,
            }),
            invalidatesTags: ["STADIUMS"],
        }),

        // دریافت لیست ورزشگاه‌ها
        getStadiums: builder.query<Stadium[], void>({
            query: () => "/stadiums",
            providesTags: ["STADIUMS"],
        }),

        // دریافت ورزشگاه با id
        getStadiumById: builder.query<Stadium, string>({
            query: (id) => `/stadiums/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "STADIUMS", id },
            ],
        }),

        // ویرایش ورزشگاه
        updateStadium: builder.mutation<
            Stadium,
            { id: string; body: UpdateStadiumDto }
        >({
            query: ({ id, body }) => ({
                url: `/stadiums/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["STADIUMS"],
        }),

        // حذف ورزشگاه
        deleteStadium: builder.mutation<void, string>({
            query: (id) => ({
                url: `/stadiums/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["STADIUMS"],
        }),

    }),
});

export const {
    useCreateStadiumMutation,
    useGetStadiumsQuery,
    useGetStadiumByIdQuery,
    useUpdateStadiumMutation,
    useDeleteStadiumMutation,
} = stadiumsApi;