import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  PLATFORM_ID,
  SecurityContext,
  inject
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { PostApiService } from '../../../core/services/post-api.service';
import { CommentApiService } from '../../../core/services/comment-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { PostDetail } from '../../../core/models/post.model';
import { CommentResponse } from '../../../core/models/comment.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private postsApi = inject(PostApiService);
  private commentsApi = inject(CommentApiService);
  readonly authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);

  loading = true;
  error: string | null = null;
  post: PostDetail | null = null;
  sanitizedContent = '';

  // Like state
  likeLoading = false;

  // Comments
  comments: CommentResponse[] = [];
  commentsLoading = false;
  commentsError: string | null = null;
  showComments = false;
  commentCount = 0;

  // Add comment
  newCommentContent = '';
  addingComment = false;
  addCommentError: string | null = null;

  // Reply
  replyingToId: string | null = null;
  replyContent = '';
  addingReply = false;

  // Edit comment
  editingCommentId: string | null = null;
  editContent = '';
  savingEdit = false;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';

    if (!slug) {
      this.error = 'Invalid post slug.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.postsApi.getBySlug(slug).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;

        this.sanitizedContent =
          this.sanitizer.sanitize(SecurityContext.HTML, post.content) ?? '';

        this.cdr.detectChanges();

        this.postsApi.recordView(post.postId).subscribe({
          next: () => {},
          error: () => {},
        });

        this.commentsApi.getCount(post.postId).subscribe({
          next: (res) => {
            this.commentCount = res.count;
            this.cdr.detectChanges();
          },
          error: () => {},
        });
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.status === 404
            ? 'Post not found.'
            : (err?.message ?? 'Request failed');
        this.cdr.detectChanges();
      },
    });
  }

  // ── Like / Unlike ──────────────────────────────────────────
  toggleLike(): void {
    if (!this.authService.isAuthenticated() || !this.post || this.likeLoading) return;

    this.likeLoading = true;
    this.cdr.detectChanges();

    const action = this.post.isLikedByCurrentUser
      ? this.postsApi.unlikePost(this.post.postId)
      : this.postsApi.likePost(this.post.postId);

    action.subscribe({
      next: () => {
        if (this.post) {
          this.post = {
            ...this.post,
            isLikedByCurrentUser: !this.post.isLikedByCurrentUser,
            likesCount: this.post.isLikedByCurrentUser
              ? this.post.likesCount - 1
              : this.post.likesCount + 1,
          };
        }
        this.likeLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.likeLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ── Comments ───────────────────────────────────────────────
  toggleComments(): void {
    this.showComments = !this.showComments;
    this.cdr.detectChanges();

    if (this.showComments && this.comments.length === 0 && this.post) {
      this.loadComments();
    }
  }

  loadComments(): void {
    if (!this.post) return;

    this.commentsLoading = true;
    this.commentsError = null;
    this.cdr.detectChanges();

    this.commentsApi.getByPost(this.post.postId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.commentsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.commentsLoading = false;
        this.commentsError = 'Failed to load comments.';
        this.cdr.detectChanges();
      },
    });
  }

  // ── Add Comment ────────────────────────────────────────────
  submitComment(): void {
    if (!this.post || !this.newCommentContent.trim()) return;

    this.addingComment = true;
    this.addCommentError = null;
    this.cdr.detectChanges();

    this.commentsApi.addComment({
      postId: this.post.postId,
      parentCommentId: null,
      content: this.newCommentContent.trim(),
    }).subscribe({
      next: (comment) => {
        this.comments = [comment, ...this.comments];
        this.newCommentContent = '';
        this.commentCount++;
        this.addingComment = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        this.addingComment = false;
        this.addCommentError = e?.error ?? 'Failed to post comment.';
        this.cdr.detectChanges();
      },
    });
  }

  // ── Reply ──────────────────────────────────────────────────
  startReply(commentId: string): void {
    this.replyingToId = commentId;
    this.replyContent = '';
    this.cdr.detectChanges();
  }

  cancelReply(): void {
    this.replyingToId = null;
    this.replyContent = '';
    this.cdr.detectChanges();
  }

  submitReply(parentCommentId: string): void {
    if (!this.post || !this.replyContent.trim()) return;

    this.addingReply = true;
    this.cdr.detectChanges();

    this.commentsApi.addComment({
      postId: this.post.postId,
      parentCommentId,
      content: this.replyContent.trim(),
    }).subscribe({
      next: (reply) => {
        this.comments = this.comments.map(c => {
          if (c.commentId === parentCommentId) {
            return { ...c, replies: [...c.replies, reply] };
          }
          return c;
        });
        this.replyingToId = null;
        this.replyContent = '';
        this.commentCount++;
        this.addingReply = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.addingReply = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ── Edit Comment ───────────────────────────────────────────
  startEdit(comment: CommentResponse): void {
    this.editingCommentId = comment.commentId;
    this.editContent = comment.content;
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editContent = '';
    this.cdr.detectChanges();
  }

  saveEdit(commentId: string): void {
    if (!this.editContent.trim()) return;

    this.savingEdit = true;
    this.cdr.detectChanges();

    this.commentsApi.updateComment(commentId, {
      content: this.editContent.trim()
    }).subscribe({
      next: (updated) => {
        this.comments = this.comments.map(c => {
          if (c.commentId === commentId) return updated;
          return {
            ...c,
            replies: c.replies.map(r =>
              r.commentId === commentId ? updated : r
            )
          };
        });
        this.editingCommentId = null;
        this.editContent = '';
        this.savingEdit = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.savingEdit = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ── Delete Comment ─────────────────────────────────────────
  deleteComment(commentId: string): void {
    if (!confirm('Delete this comment?')) return;

    this.commentsApi.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments
          .filter(c => c.commentId !== commentId)
          .map(c => ({
            ...c,
            replies: c.replies.filter(r => r.commentId !== commentId)
          }));
        this.commentCount = Math.max(0, this.commentCount - 1);
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  // ── Like Comment ───────────────────────────────────────────
  toggleCommentLike(comment: CommentResponse): void {
    if (!this.authService.isAuthenticated()) return;

    const action = comment.isLikedByCurrentUser
      ? this.commentsApi.unlikeComment(comment.commentId)
      : this.commentsApi.likeComment(comment.commentId);

    action.subscribe({
      next: (updated) => {
      this.comments = this.comments.map(c => {
        if (c.commentId === updated.commentId) {
          return { ...updated, replies: c.replies };
        }
        return {
          ...c,
          replies: c.replies.map(r =>
            r.commentId === updated.commentId
              ? { ...updated, replies: r.replies }
              : r
          )
        };
      });
      this.cdr.detectChanges();
    },
      error: () => {},
    });
  }

  // ── Helpers ────────────────────────────────────────────────
  isOwnComment(comment: CommentResponse): boolean {
    const user = this.authService.currentUser();
    return !!user && user.userId === comment.authorId;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
