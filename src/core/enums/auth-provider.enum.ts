const Providers = {
  EMAIL: 'EMAIL',
  GOOGLE: 'GOOGLE',
} as const;

export type ProviderType = keyof typeof Providers;
