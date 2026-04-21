import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { PostApiService } from '../../core/services/post-api.service';
import { PostSummary } from '../../core/models/post.model';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './author.component.html',
  styleUrl: './author.component.css',
})
export class AuthorComponent implements OnInit {
  private postsApi = inject(PostApiService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  loading = false;
  error: string | null = null;

  authorId: string | null = null;
  posts: PostSummary[] = [];

  ngOnInit(): void {
    // Router state is only reliable in browser
    if (!isPlatformBrowser(this.platformId)) {
      this.error = 'Author page is not available on server render.';
      return;
    }

    const state = history.state as { authorId?: string };
    this.authorId = state?.authorId ?? null;

    if (!this.authorId) {
      this.error = 'No author selected. Go back to feed and choose an author.';
      return;
    }

    this.loading = true;
    this.postsApi.getByAuthor(this.authorId).subscribe({
      next: (res) => {
        this.posts = res.posts;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.message ?? 'Request failed';
      },
    });
  }

  openPost(slug: string) {
    this.router.navigate(['/post', slug]);
  }
}
