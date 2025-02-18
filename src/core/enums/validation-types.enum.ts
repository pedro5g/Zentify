export const validationTypes = {
  FORGET_PASSWORD: 'FORGET_PASSWORD',
} as const;

export type ValidationTypes = keyof typeof validationTypes;
