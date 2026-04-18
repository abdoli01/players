import { baseApi } from "./baseApi";
import {
    Color,
    CreateColorDto,
    UpdateColorDto,
} from "@/types/color";

export const colorsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // create
        createColor: builder.mutation<Color, CreateColorDto>({
            query: (body) => ({
                url: "/color-palettes",
                method: "POST",
                body,
            }),
            invalidatesTags: ["COLORS"],
        }),

        // list
        getColors: builder.query<Color[], void>({
            query: () => "/color-palettes",
            providesTags: ["COLORS"],
        }),

        // get default
        getDefaultColor: builder.query<Color, void>({
            query: () => "/color-palettes-default",
            providesTags: ["COLORS"],
        }),

        // update default
        updateDefaultColor: builder.mutation<Color, UpdateColorDto>({
            query: (body) => ({
                url: "/color-palettes-default",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["COLORS"],
        }),

        // get by id
        getColorById: builder.query<Color, string>({
            query: (id) => `/color-palettes/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "COLORS", id },
            ],
        }),

        // update
        updateColor: builder.mutation<
            Color,
            { id: string; body: UpdateColorDto }
        >({
            query: ({ id, body }) => ({
                url: `/color-palettes/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["COLORS"],
        }),

        // delete
        deleteColor: builder.mutation<void, string>({
            query: (id) => ({
                url: `/color-palettes/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["COLORS"],
        }),
    }),
});

export const {
    useCreateColorMutation,
    useGetColorsQuery,
    useGetDefaultColorQuery,
    useUpdateDefaultColorMutation,
    useGetColorByIdQuery,
    useUpdateColorMutation,
    useDeleteColorMutation,
} = colorsApi;