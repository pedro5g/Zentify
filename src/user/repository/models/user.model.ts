export interface User {
  id: string;
  name: string;
  email: string | null;
  password: string | null;
  profileUrl: string | null;
  emailVerified: boolean;
  lastLogin: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
