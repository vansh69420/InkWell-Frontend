import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static routes you *can* prerender safely
  { path: 'home', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'register', renderMode: RenderMode.Prerender },

  // Dynamic route (has params) -> must NOT be prerendered without getPrerenderParams
  { path: 'post/:slug', renderMode: RenderMode.Server },

  // These depend on auth/router-state, so prerendering is usually not useful
  { path: 'profile', renderMode: RenderMode.Server },
  { path: 'author', renderMode: RenderMode.Server },

  // Fallback
  { path: '**', renderMode: RenderMode.Server },
];
