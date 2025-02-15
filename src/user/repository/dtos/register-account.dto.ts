import { ProviderType } from '@/core/enums/auth-provider.enum';

export interface RegisterAccountDTO {
  name: string;
  email?: string;
  profileUrl?: string;
  provideId: string;
  provider: ProviderType;
}
