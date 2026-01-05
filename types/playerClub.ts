// types/playerClub.ts

export interface PlayerClub {
    id: string;
    playerId: string;
    clubId: string;
    sportId: string;
    startDate: string; // YYYY-MM-DD
    endDate?: string;  // YYYY-MM-DD یا undefined
    createdAt: string;
    updatedAt: string;
}

// DTO برای ایجاد
export interface CreatePlayerClubDto {
    playerId: string;
    clubId: string;
    sportId: string;
    startDate: string;
    endDate?: string;
}

// DTO برای بروزرسانی
export interface UpdatePlayerClubDto {
    playerId?: string;
    clubId?: string;
    sportId?: string;
    startDate?: string;
    endDate?: string;
}

// پارامترهای جستجو
export interface PlayerClubSearchParams {
    q?: string;
    playerId?: string;
    clubId?: string;
    sportId?: string;
    startDate?: string;
    endDate?: string;
}
