export interface CheckUsernameDto {
    username: string;
}

export interface RegisterDto {
    username: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
    code: string;
}

export interface LoginDto {
    username: string;
    password: string;
}

export interface SetPasswordDto {
    username: string;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface VerifyResetPasswordDto {
    username: string;
    code: string;
    newPassword: string;
}

export interface UserProfile {
    username: string;
    firstName: string;
    lastName: string;
}
// DTOs
export interface SetPlayerIdDto {
    playerId: string; // شناسه بازیکن
}

export interface AdminSetPlayerIdDto {
    userId: string;   // شناسه کاربر
    playerId: string; // شناسه بازیکن
}
