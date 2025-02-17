export interface RegisterResetPasswordDTO {
  userId: string;
  code: string;
  expiresAt: Date | string;
}
