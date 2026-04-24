import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommentResponse, AddCommentRequest, UpdateCommentRequest } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentApiService {
  private http = inject(HttpClient);
  private base = environment.gateway;

  getByPost(postId: string) {
    return this.http.get<CommentResponse[]>(
      `${this.base}/comments/post/${postId}`
    );
  }

  getCount(postId: string) {
    return this.http.get<{ count: number }>(
      `${this.base}/comments/count/${postId}`
    );
  }

  addComment(req: AddCommentRequest) {
    return this.http.post<CommentResponse>(
      `${this.base}/comments`, req
    );
  }

  updateComment(commentId: string, req: UpdateCommentRequest) {
    return this.http.put<CommentResponse>(
      `${this.base}/comments/${commentId}`, req
    );
  }

  deleteComment(commentId: string) {
    return this.http.delete<void>(
      `${this.base}/comments/${commentId}`
    );
  }

  likeComment(commentId: string) {
    return this.http.post<CommentResponse>(
      `${this.base}/comments/${commentId}/like`, {}
    );
  }

  unlikeComment(commentId: string) {
    return this.http.post<CommentResponse>(
      `${this.base}/comments/${commentId}/unlike`, {}
    );
  }
}
