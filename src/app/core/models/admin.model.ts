export interface UserListResponse {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  provider: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuditLogResponse {
  auditLogId: string;
  actorId: string;
  actorUsername: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: string | null;
  createdAt: string;
}

export interface MostViewedPost {
  postId: string;
  title: string;
  viewCount: number;
  likesCount: number;
  slug: string;
}

export interface PlatformAnalytics {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  newsletterSubscribers: number;
  mostViewedPosts: any[];
}
