export interface SendResetPasswordServiceDTO {
  code: string;
  expiresAt: string | Date;
  email: string;
}
