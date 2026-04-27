import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserListResponse, AuditLogResponse, PlatformAnalytics } from '../models/admin.model';
import { PostSummary } from '../models/post.model';
import { SubscriberResponse, SendNewsletterRequest } from '../models/newsletter.model';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);
  private base = environment.gateway;

  getAllUsers(): Observable<UserListResponse[]> {
    return this.http.get<UserListResponse[]>(`${this.base}/admin/users`);
  }

  changeRole(userId: string, role: string): Observable<UserListResponse> {
    return this.http.put<UserListResponse>(
      `${this.base}/admin/users/${userId}/role`,
      { role }
    );
  }

  suspendUser(userId: string): Observable<void> {
    return this.http.put<void>(
      `${this.base}/admin/users/${userId}/suspend`, {}
    );
  }

  reactivateUser(userId: string): Observable<void> {
    return this.http.put<void>(
      `${this.base}/admin/users/${userId}/reactivate`, {}
    );
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/users/${userId}`);
  }

  getAllPosts(): Observable<PostSummary[]> {
    return this.http.get<PostSummary[]>(`${this.base}/posts/published`);
  }

  featurePost(postId: string): Observable<void> {
    return this.http.put<void>(`${this.base}/posts/${postId}/feature`, {});
  }

  unfeaturePost(postId: string): Observable<void> {
    return this.http.put<void>(`${this.base}/posts/${postId}/unfeature`, {});
  }

  deletePost(postId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/posts/${postId}`);
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/categories`);
  }

  createCategory(name: string, description?: string): Observable<any> {
    return this.http.post<any>(`${this.base}/categories`, { name, description });
  }

  deleteCategory(categoryId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/categories/${categoryId}`);
  }

  getAllTags(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/tags`);
  }

  createTag(name: string): Observable<any> {
    return this.http.post<any>(`${this.base}/tags`, { name });
  }

  deleteTag(tagId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/tags/${tagId}`);
  }

  getPlatformAnalytics(): Observable<PlatformAnalytics> {
    return this.http.get<PlatformAnalytics>(`${this.base}/api/analytics/platform`);
  }

  getAuditLogs(): Observable<AuditLogResponse[]> {
    return this.http.get<AuditLogResponse[]>(`${this.base}/admin/audit-logs`);
  }

  getAllSubscribers(): Observable<SubscriberResponse[]> {
    return this.http.get<SubscriberResponse[]>(`${this.base}/newsletter/subscribers`);
  }

  sendNewsletter(req: SendNewsletterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/newsletter/send`, req);
  }
}
