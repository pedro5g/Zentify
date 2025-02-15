import { ProviderType } from '@/core/enums/auth-provider.enum';

export interface Account {
  id: string;
  userId: string;
  provider: ProviderType;
  providerIdOrEmail: string;
  createdAt: Date | string;
}
