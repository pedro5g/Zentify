export interface UpdateUserDTO {
  id: string;
  name: string;
  profileUrl: string | null;
  emailVerified: boolean;
  lastLogin: Date | string | null;
}
