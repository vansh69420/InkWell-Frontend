import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminApiService } from '../../core/services/admin-api.service';
import { AuthService } from '../../core/services/auth.service';
import { UserListResponse, AuditLogResponse, PlatformAnalytics } from '../../core/models/admin.model';
import { PostSummary } from '../../core/models/post.model';
import { SubscriberResponse } from '../../core/models/newsletter.model';

type AdminTab = 'analytics' | 'users' | 'posts' | 'taxonomy' | 'comments' | 'newsletter' | 'audit';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  activeTab: AdminTab = 'analytics';

  // Analytics
  analytics: PlatformAnalytics | null = null;
  analyticsLoading = false;

  // Users
  users: UserListResponse[] = [];
  usersLoading = false;
  usersError: string | null = null;

  // Posts
  posts: PostSummary[] = [];
  postsLoading = false;

  // Taxonomy
  categories: any[] = [];
  tags: any[] = [];
  taxonomyLoading = false;
  newCategoryName = '';
  newCategoryDescription = '';
  newTagName = '';

  // Newsletter
  subscribers: SubscriberResponse[] = [];
  newsletterLoading = false;
  newsletterSubject = '';
  newsletterContent = '';
  sendingNewsletter = false;
  newsletterSuccess: string | null = null;
  newsletterError: string | null = null;

  // Audit Logs
  auditLogs: AuditLogResponse[] = [];
  auditLoading = false;

  ngOnInit(): void {
    this.loadAnalytics();
  }

  setTab(tab: string): void {
  this.activeTab = tab as AdminTab;

    switch (tab) {
      case 'analytics': this.loadAnalytics(); break;
      case 'users': this.loadUsers(); break;
      case 'posts': this.loadPosts(); break;
      case 'taxonomy': this.loadTaxonomy(); break;
      case 'newsletter': this.loadSubscribers(); break;
      case 'audit': this.loadAuditLogs(); break;
    }
  }

  // ── Analytics ──────────────────────────────────────────────
  loadAnalytics(): void {
    this.analyticsLoading = true;
    this.cdr.detectChanges();

    this.adminApi.getPlatformAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.analyticsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.analyticsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ── Users ──────────────────────────────────────────────────
  loadUsers(): void {
    this.usersLoading = true;
    this.cdr.detectChanges();

    this.adminApi.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.usersLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.usersLoading = false;
        this.usersError = 'Failed to load users.';
        this.cdr.detectChanges();
      },
    });
  }

  changeRole(userId: string, role: string): void {
    this.adminApi.changeRole(userId, role).subscribe({
      next: (updated) => {
        this.users = this.users.map(u =>
          u.userId === userId ? updated : u
        );
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  suspendUser(userId: string): void {
    if (!confirm('Suspend this user?')) return;

    this.adminApi.suspendUser(userId).subscribe({
      next: () => {
        this.users = this.users.map(u =>
          u.userId === userId ? { ...u, isActive: false } : u
        );
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  reactivateUser(userId: string): void {
    this.adminApi.reactivateUser(userId).subscribe({
      next: () => {
        this.users = this.users.map(u =>
          u.userId === userId ? { ...u, isActive: true } : u
        );
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  deleteUser(userId: string): void {
    if (!confirm('Permanently delete this user? This cannot be undone.')) return;

    this.adminApi.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.userId !== userId);
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  // ── Posts ──────────────────────────────────────────────────
  loadPosts(): void {
    this.postsLoading = true;
    this.cdr.detectChanges();

    this.adminApi.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.postsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.postsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  featurePost(postId: string): void {
    this.adminApi.featurePost(postId).subscribe({
      next: () => {
        this.posts = this.posts.map(p =>
          p.postId === postId ? { ...p, isFeatured: true } : p
        );
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  unfeaturePost(postId: string): void {
    this.adminApi.unfeaturePost(postId).subscribe({
      next: () => {
        this.posts = this.posts.map(p =>
          p.postId === postId ? { ...p, isFeatured: false } : p
        );
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  deletePost(postId: string): void {
    if (!confirm('Delete this post?')) return;

    this.adminApi.deletePost(postId).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.postId !== postId);
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  // ── Taxonomy ───────────────────────────────────────────────
  loadTaxonomy(): void {
    this.taxonomyLoading = true;
    this.cdr.detectChanges();

    this.adminApi.getAllCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.cdr.detectChanges();
      },
    });

    this.adminApi.getAllTags().subscribe({
      next: (tags) => {
        this.tags = tags;
        this.taxonomyLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  createCategory(): void {
    if (!this.newCategoryName.trim()) return;

    this.adminApi.createCategory(
      this.newCategoryName.trim(),
      this.newCategoryDescription.trim() || undefined
    ).subscribe({
      next: (cat) => {
        this.categories = [cat, ...this.categories];
        this.newCategoryName = '';
        this.newCategoryDescription = '';
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  deleteCategory(categoryId: string): void {
    if (!confirm('Delete this category?')) return;

    this.adminApi.deleteCategory(categoryId).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.categoryId !== categoryId);
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  createTag(): void {
    if (!this.newTagName.trim()) return;

    this.adminApi.createTag(this.newTagName.trim()).subscribe({
      next: (tag) => {
        this.tags = [tag, ...this.tags];
        this.newTagName = '';
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  deleteTag(tagId: string): void {
    if (!confirm('Delete this tag?')) return;

    this.adminApi.deleteTag(tagId).subscribe({
      next: () => {
        this.tags = this.tags.filter(t => t.tagId !== tagId);
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  // ── Newsletter ─────────────────────────────────────────────
  loadSubscribers(): void {
    this.newsletterLoading = true;
    this.cdr.detectChanges();

    this.adminApi.getAllSubscribers().subscribe({
      next: (subs) => {
        this.subscribers = subs;
        this.newsletterLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.newsletterLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  sendNewsletter(): void {
    if (!this.newsletterSubject.trim() || !this.newsletterContent.trim()) return;
    if (!confirm(`Send newsletter to all active subscribers?`)) return;

    this.sendingNewsletter = true;
    this.newsletterSuccess = null;
    this.newsletterError = null;
    this.cdr.detectChanges();

    this.adminApi.sendNewsletter({
      subject: this.newsletterSubject.trim(),
      htmlContent: this.newsletterContent.trim(),
    }).subscribe({
      next: (res) => {
        this.newsletterSuccess = res.message;
        this.newsletterSubject = '';
        this.newsletterContent = '';
        this.sendingNewsletter = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.newsletterError = 'Failed to send newsletter.';
        this.sendingNewsletter = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ── Audit Logs ─────────────────────────────────────────────
  loadAuditLogs(): void {
    this.auditLoading = true;
    this.cdr.detectChanges();

    this.adminApi.getAuditLogs().subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.auditLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.auditLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ── Helpers ────────────────────────────────────────────────
  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCurrentUserId(): string {
    return this.authService.currentUser()?.userId ?? '';
  }
}
