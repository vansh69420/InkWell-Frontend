import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PostApiService } from '../../core/services/post-api.service';
import { MyPostSummary } from '../../core/models/post-write.model';

@Component({
  selector: 'app-author-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './author-dashboard.component.html',
})
export class AuthorDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private postsApi = inject(PostApiService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  error: string | null = null;
  posts: MyPostSummary[] = [];

  ngOnInit(): void {
    const user = this.auth.currentUser();

    if (!user) {
      this.loading = false;
      this.cdr.detectChanges();
      this.router.navigate(['/login']);
      return;
    }

    if (user.role !== 'Author' && user.role !== 'Admin') {
      this.loading = false;
      this.error = 'You must be an Author or Admin to access this page.';
      this.cdr.detectChanges();
      return;
    }

    this.postsApi.getMyPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load posts.';
        this.cdr.detectChanges();
      },
    });
  }

  newPost() {
    sessionStorage.removeItem('inkwell_edit_post_id');
    this.router.navigate(['/author/new']);
  }

   edit(postId: string) {
    sessionStorage.setItem('inkwell_edit_post_id', postId);
    this.router.navigate(['/author/edit']);
  }
}
