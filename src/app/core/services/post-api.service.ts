import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthorPostsResponse, PostDetail, PostSummary, PostCountResponse } from '../models/post.model';
import { CreatePostRequest, UpdatePostRequest, MyPostSummary, PostEditor } from '../models/post-write.model';
@Injectable({ providedIn: 'root' })
export class PostApiService {
  private http = inject(HttpClient);
  private base = environment.gateway;

  getPublished() {
    return this.http.get<PostSummary[]>(`${this.base}/posts/published`);
  }

  getBySlug(slug: string) {
    return this.http.get<PostDetail>(`${this.base}/posts/slug/${encodeURIComponent(slug)}`);
  }

  search(keyword: string) {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<PostSummary[]>(`${this.base}/posts/search`, { params });
  }

  getByCategory(categoryId: string) {
    return this.http.get<PostSummary[]>(`${this.base}/posts/category/${categoryId}`);
  }

  getByTag(tagId: string) {
    return this.http.get<PostSummary[]>(`${this.base}/posts/tag/${tagId}`);
  }

  getByAuthor(authorId: string) {
    return this.http.get<AuthorPostsResponse>(`${this.base}/posts/author/${authorId}`);
  }

  getCount() {
    return this.http.get<PostCountResponse>(`${this.base}/posts/count`);
  }

  getMyPosts() {
  return this.http.get<MyPostSummary[]>(`${this.base}/posts/me`);
}

getForEdit(postId: string) {
  return this.http.get<PostEditor>(`${this.base}/posts/${postId}`);
}

createPost(req: CreatePostRequest) {
  return this.http.post<PostEditor>(`${this.base}/posts`, req);
}

updatePost(postId: string, req: UpdatePostRequest) {
  return this.http.put<PostEditor>(`${this.base}/posts/${postId}`, req);
}

publish(postId: string) {
  return this.http.put<PostEditor>(`${this.base}/posts/${postId}/publish`, {});
}

unpublish(postId: string) {
  return this.http.put<PostEditor>(`${this.base}/posts/${postId}/unpublish`, {});
}

delete(postId: string) {
  return this.http.delete<void>(`${this.base}/posts/${postId}`);
}

  // Unique-session view counting relies on cookies; must use withCredentials
  recordView(postId: string) {
    return this.http.post<void>(
      `${this.base}/posts/${postId}/view`,
      {},
      { withCredentials: true }
    );
  }
}
