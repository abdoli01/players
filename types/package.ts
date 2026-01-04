export interface CreatePackageDto {
    title: string;
    description?: string;
    originalPrice: number;
    discountPrice?: number;
    freeUsageDays?: number;
    freeDisplayMinutes?: number;
    freeDownloadMinutes?: number;
    usageDays?: number;
    displayMinutes?: number;
    downloadMinutes?: number;
}

export interface UpdatePackageDto extends Partial<CreatePackageDto> {}

export interface Package {
    id: string;
    title: string;
    description?: string;
    originalPrice: number;
    discountPrice?: number;
    freeUsageDays?: number;
    freeDisplayMinutes?: number;
    freeDownloadMinutes?: number;
    usageDays?: number;
    displayMinutes?: number;
    downloadMinutes?: number;
    createdAt: string;
    updatedAt: string;
}

export interface PackageSearchParams {
    q?: string;
    title?: string;
    description?: string;
    originalPriceMin?: number;
    originalPriceMax?: number;
    discountPriceMin?: number;
    discountPriceMax?: number;
    freeUsageDays?: number;
    freeDisplayMinutes?: number;
    freeDownloadMinutes?: number;
    usageDays?: number;
    displayMinutes?: number;
    downloadMinutes?: number;
}
