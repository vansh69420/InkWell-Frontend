import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { PostApiService } from '../../core/services/post-api.service';
import { TaxonomyApiService } from '../../core/services/taxonomy-api.service';
import { PostSummary } from '../../core/models/post.model';
import { Category, Tag } from '../../core/models/taxonomy.model';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private postsApi = inject(PostApiService);
  private taxonomyApi = inject(TaxonomyApiService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  loadingPosts = false;
  loadingCategories = false;
  loadingTags = false;

  errorPosts: string | null = null;
  errorCategories: string | null = null;
  errorTags: string | null = null;

  posts: PostSummary[] = [];
  categories: Category[] = [];
  tags: Tag[] = [];

  keyword = '';
  selectedCategoryId: string | null = null;
  selectedTagId: string | null = null;

  ngOnInit(): void {
    this.loadFeed();
    this.loadCategories();
    this.loadTags();
  }

  loadFeed() {
  this.loadingPosts = true;
  this.errorPosts = null;
  this.cdr.detectChanges();

  this.postsApi.getPublished().subscribe({
    next: (posts) => {
      this.posts = posts;
      this.loadingPosts = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.loadingPosts = false;
      this.errorPosts = this.getErr(err);
      this.cdr.detectChanges();
    },
  });
}

  loadCategories() {
  this.loadingCategories = true;
  this.errorCategories = null;
  this.cdr.detectChanges();

  this.taxonomyApi.getCategories().subscribe({
    next: (categories) => {
      this.categories = categories;
      this.loadingCategories = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.loadingCategories = false;
      this.errorCategories = this.getErr(err);
      this.cdr.detectChanges();
    },
  });
}

   loadTags() {
  this.loadingTags = true;
  this.errorTags = null;
  this.cdr.detectChanges();

  this.taxonomyApi.getTags().subscribe({
    next: (tags) => {
      this.tags = tags;
      this.loadingTags = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.loadingTags = false;
      this.errorTags = this.getErr(err);
      this.cdr.detectChanges();
    },
  });
}

  onSearch() {
    const kw = this.keyword.trim();

    this.selectedCategoryId = null;
    this.selectedTagId = null;

    if (!kw) {
      this.loadFeed();
      return;
    }

    this.loadingPosts = true;
    this.errorPosts = null;

    this.postsApi.search(kw).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loadingPosts = false;
      },
      error: (err) => {
        this.loadingPosts = false;
        this.errorPosts = this.getErr(err);
      },
    });
  }

  onCategoryChange() {
    this.keyword = '';
    this.selectedTagId = null;

    if (!this.selectedCategoryId) {
      this.loadFeed();
      return;
    }

    this.loadingPosts = true;
    this.errorPosts = null;

    this.postsApi.getByCategory(this.selectedCategoryId).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loadingPosts = false;
      },
      error: (err) => {
        this.loadingPosts = false;
        this.errorPosts = this.getErr(err);
      },
    });
  }

  onTagChange() {
    this.keyword = '';
    this.selectedCategoryId = null;

    if (!this.selectedTagId) {
      this.loadFeed();
      return;
    }

    this.loadingPosts = true;
    this.errorPosts = null;

    this.postsApi.getByTag(this.selectedTagId).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loadingPosts = false;
      },
      error: (err) => {
        this.loadingPosts = false;
        this.errorPosts = this.getErr(err);
      },
    });
  }

  clearFilters() {
    this.keyword = '';
    this.selectedCategoryId = null;
    this.selectedTagId = null;
    this.loadFeed();
  }

  openPost(slug: string) {
    this.router.navigate(['/post', slug]);
  }

  openAuthor(authorId: string) {
    this.router.navigate(['/author'], { state: { authorId } });
  }

  trackByPostId(_: number, p: PostSummary) {
    return p.postId;
  }

  private getErr(err: any): string {
    if (err?.error) return typeof err.error === 'string' ? err.error : 'Request failed';
    return err?.message ?? 'Request failed';
  }
}
