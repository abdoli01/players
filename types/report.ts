export interface ReportKeyDto {
    title: string;
    key: string;
}
export interface ReportResponseDto {
    data:any
}
export interface GetReportKeywordsParams {
    keyword: "PLAYER" | "CLUB";
}
export interface GetReportParams {
    keyword: "PLAYER" | "CLUB";
    key: string;
    playerId?: string;
    seasonId?: string;
}