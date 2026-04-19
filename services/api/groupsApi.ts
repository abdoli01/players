import { baseApi } from "./baseApi";
import {
    Group,
    CreateGroupDto,
    UpdateGroupDto,
} from "@/types/group";

export const groupsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ایجاد گروه
        createGroup: builder.mutation<Group, CreateGroupDto>({
            query: (body) => ({
                url: "/groups",
                method: "POST",
                body,
            }),
            invalidatesTags: ["GROUPS"],
        }),

        // دریافت لیست گروه‌ها
        getGroups: builder.query<Group[], void>({
            query: () => "/groups",
            providesTags: ["GROUPS"],
        }),

        // دریافت گروه با id
        getGroupById: builder.query<Group, string>({
            query: (id) => `/groups/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "GROUPS", id },
            ],
        }),

        // ویرایش گروه
        updateGroup: builder.mutation<
            Group,
            { id: string; body: UpdateGroupDto }
        >({
            query: ({ id, body }) => ({
                url: `/groups/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["GROUPS"],
        }),

        // حذف گروه
        deleteGroup: builder.mutation<void, string>({
            query: (id) => ({
                url: `/groups/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["GROUPS"],
        }),

    }),
});

export const {
    useCreateGroupMutation,
    useGetGroupsQuery,
    useGetGroupByIdQuery,
    useUpdateGroupMutation,
    useDeleteGroupMutation,
} = groupsApi;