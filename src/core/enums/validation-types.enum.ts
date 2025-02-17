export const validationTypes = {
  EMAIL_VERIFY: 'EMAIL_VERIFY',
  FORGET_PASSWORD: 'FORGET_PASSWORD',
} as const;

export type ValidationTypes = keyof typeof validationTypes;
