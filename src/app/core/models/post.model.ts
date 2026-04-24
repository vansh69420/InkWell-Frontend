export interface PostSummary {
  postId: string;
  authorId: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImageUrl?: string | null;
  readTimeMin: number;
  viewCount: number;
  likesCount: number;
  createdAt: string;
  publishedAt?: string | null;
}

export interface PostDetail {
  postId: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImageUrl?: string | null;
  readTimeMin: number;
  viewCount: number;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
  updatedAt?: string | null;
  publishedAt?: string | null;
  categoryIds: string[];
  tagIds: string[];
}

export interface AuthorPostsResponse {
  authorId: string;
  posts: PostSummary[];
}

export interface PostCountResponse {
  count: number;
}
