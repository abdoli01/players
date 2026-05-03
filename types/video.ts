export type VideoKeyword =
    | "PLAYER"
    | "FOOTBALL_PLAYER_OUTFIELD"
    | "FOOTBALL_PLAYER_GOALKEEPER";

// ------------------
// Keywords
// ------------------
export interface VideoKey {
    title: string;
    key: string;
}

// ------------------
// Tree Items
// ------------------
export interface VideoActionItem {
    title: string;
    key: string;
    hasChildren: boolean;
    items: VideoActionItem[] | null;
}

// ------------------
// Items Response
// ------------------
export interface VideosReportItemsResponse {
    data: {
        title: string;
        key: string;
        items: VideoActionItem[];
    };
}

// ------------------
// Video Item
// ------------------
export interface VideoReportItem {
    actionName: string;
    videoTitle: string;
    timeCode: string;
    videoSource: string;
    downloadEnabled: boolean;
    endTimeCode: string;
    startTimeCode: string;

    xT: number | null;
    matchId: string | null;
    teamId: string | null;
    teamName: string | null;

    playerId: string | null;
    playerFullName: string | null;
    playerKitNumber: number | null;

    homeTeamId: string | null;
    homeTeamName: string | null;

    guestTeamId: string | null;
    guestTeamName: string | null;

    homeScore: number | null;
    guestScore: number | null;
}

// ------------------
// Videos Response
// ------------------
export interface VideosResponse {
    data: {
        title: string;
        key: string;
        items: VideoReportItem[];
    };
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    } | null;
}

// ------------------
// Query Params
// ------------------
export interface GetVideoKeywordsParams {
    keyword: VideoKeyword;
}

export interface GetVideoItemsParams {
    keyword: VideoKeyword;
    key: string;
}

export interface GetVideosParams {
    keyword: VideoKeyword;
    key: string;

    playerId?: string;
    sessionId?: string;

    page?: number;
    limit?: number;

    items: string[];
}