import { baseApi } from "./baseApi";
import {
    Package,
    CreatePackageDto,
    UpdatePackageDto,
    PackageSearchParams,
} from "@/types/package";

export const packagesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /packages
        createPackage: builder.mutation<Package, CreatePackageDto>({
            query: (body) => ({
                url: "/packages",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PACKAGES"],
        }),

        // GET /packages
        getPackages: builder.query<Package[], void>({
            query: () => "/packages",
            providesTags: ["PACKAGES"],
        }),

        // GET /packages/search
        searchPackages: builder.query<Package[], PackageSearchParams>({
            query: (params) => ({
                url: "/packages/search",
                params,
            }),
            providesTags: ["PACKAGES"],
        }),

        // GET /packages/{id}
        getPackageById: builder.query<Package, string>({
            query: (id) => `/packages/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "PACKAGES", id },
            ],
        }),

        // PATCH /packages/{id}
        updatePackage: builder.mutation<
            Package,
            { id: string; body: UpdatePackageDto }
        >({
            query: ({ id, body }) => ({
                url: `/packages/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["PACKAGES"],
        }),

        // DELETE /packages/{id}
        deletePackage: builder.mutation<void, string>({
            query: (id) => ({
                url: `/packages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PACKAGES"],
        }),

    }),
});

export const {
    useCreatePackageMutation,
    useGetPackagesQuery,
    useSearchPackagesQuery,
    useGetPackageByIdQuery,
    useUpdatePackageMutation,
    useDeletePackageMutation,
} = packagesApi;
