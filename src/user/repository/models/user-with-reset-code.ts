import { ValidationTypes } from '@/core/enums/validation-types.enum';

export interface UserWithResetCode {
  resetId: number;
  userId: string;
  code: string;
  type: ValidationTypes;
  expiresAt: Date | string;
  id: string;
  name: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
}
