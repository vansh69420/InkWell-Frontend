export interface User {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  role: 'Reader' | 'Author' | 'Admin';
  provider: string;
  isActive: boolean;
  createdAt: string;
}
