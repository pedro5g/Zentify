const uuid = require('node:crypto').randomUUID;

export const codeGenerate = () => {
  return uuid().replace('-', '').slice(0, 10);
};
