export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  categoryIds: string[];
  tagIds: string[];
}

export interface UpdatePostRequest extends CreatePostRequest {}

export type PostStatus = 'Draft' | 'Published' | 'Unpublished' | 'Archived';

export interface MyPostSummary {
  postId: string;
  authorId: string;
  title: string;
  slug: string;
  status: PostStatus;
  readTimeMin: number;
  viewCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt?: string | null;
  publishedAt?: string | null;
}

export interface PostEditor {
  postId: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImageUrl?: string | null;
  status: PostStatus;
  readTimeMin: number;
  viewCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt?: string | null;
  publishedAt?: string | null;
  categoryIds: string[];
  tagIds: string[];
}
