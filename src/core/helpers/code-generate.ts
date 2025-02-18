const uuid = require('node:crypto').randomUUID;

export const codeGenerate = (): string => {
  return uuid().replace('-', '').slice(0, 10);
};
