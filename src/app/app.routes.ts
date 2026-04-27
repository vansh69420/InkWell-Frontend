import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },

  {
    path: 'post/:slug',
    loadComponent: () =>
      import('./features/posts/post-detail/post-detail.component').then(
        (m) => m.PostDetailComponent
      ),
  },

  {
    path: 'author/dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/author-dashboard/author-dashboard.component').then(
        (m) => m.AuthorDashboardComponent
      ),
  },

  {
    path: 'author/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/post-editor/post-editor.component').then(
        (m) => m.PostEditorComponent
      ),
  },

  {
    path: 'author/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/post-editor/post-editor.component').then(
        (m) => m.PostEditorComponent
      ),
  },

  {
    path: 'author',
    loadComponent: () =>
      import('./features/author/author.component').then(
        (m) => m.AuthorComponent
      ),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },

  {
    path: 'media-library',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/media-library/media-library.component').then(
        (m) => m.MediaLibraryComponent
      ),
  },

  {
    path: 'newsletter/confirmed',
    loadComponent: () =>
      import('./features/newsletter/newsletter-confirmed.component').then(
        (m) => m.NewsletterConfirmedComponent
      ),
  },

  {
    path: 'newsletter/unsubscribed',
    loadComponent: () =>
      import('./features/newsletter/newsletter-unsubscribed.component').then(
        (m) => m.NewsletterUnsubscribedComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },

  { path: '**', redirectTo: 'home' },
];
