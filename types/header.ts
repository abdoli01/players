// types/header.ts
export interface HeaderFieldDto {
    title: string;
    key: string;
    value: any;
}

export interface HeaderPlayerResponseDto {
    fullName: HeaderFieldDto;
    image?: HeaderFieldDto;
    club?: HeaderFieldDto;
    kitNumber?: HeaderFieldDto;
    age: HeaderFieldDto;
}
