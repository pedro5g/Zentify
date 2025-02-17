import { ValidationTypes } from '@/core/enums/validation-types.enum';

export interface ResetPasswordCode {
  userId: string;
  code: string;
  type: ValidationTypes;
  expiresAt: Date | string;
  createdAt: Date | string;
}
