import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, SecurityContext, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { PostApiService } from '../../../core/services/post-api.service';
import { PostDetail } from '../../../core/models/post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private postsApi = inject(PostApiService);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);

  loading = false;
  error: string | null = null;
  post: PostDetail | null = null;

  sanitizedContent = '';

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';

    if (!slug) {
      this.error = 'Invalid post slug.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.postsApi.getBySlug(slug).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;

        // sanitize (do NOT bypass security)
        this.sanitizedContent =
          this.sanitizer.sanitize(SecurityContext.HTML, post.content) ?? '';

        this.cdr.detectChanges();

        this.postsApi.recordView(post.postId).subscribe({
          next: () => {},
          error: () => {},
        });
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.status === 404 ? 'Post not found.' : (err?.message ?? 'Request failed');

        this.cdr.detectChanges();
      },
    });
  }
}
