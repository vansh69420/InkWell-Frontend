import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'home', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'register', renderMode: RenderMode.Prerender },
  { path: 'post/:slug', renderMode: RenderMode.Server },

  { path: 'author/dashboard', renderMode: RenderMode.Client },
  { path: 'author/new', renderMode: RenderMode.Client },
  { path: 'author/edit', renderMode: RenderMode.Client },
  { path: 'profile', renderMode: RenderMode.Client },
  { path: 'author', renderMode: RenderMode.Client },

  { path: 'media-library', renderMode: RenderMode.Client },
  { path: 'newsletter/confirmed', renderMode: RenderMode.Prerender },
  { path: 'newsletter/unsubscribed', renderMode: RenderMode.Prerender },
  { path: 'admin', renderMode: RenderMode.Client },

  { path: '**', renderMode: RenderMode.Server },
];
