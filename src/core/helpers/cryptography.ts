import * as bcrypt from 'bcryptjs';

const SALT = 10;

export const passwordToHash = async (password: string) => {
  return await bcrypt.hash(password, SALT);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
