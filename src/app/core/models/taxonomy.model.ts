export interface Category {
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  parentCategoryId?: string | null;
  postCount: number;
  createdAt: string;
}

export interface Tag {
  tagId: string;
  name: string;
  slug: string;
  postCount: number;
  createdAt: string;
}
