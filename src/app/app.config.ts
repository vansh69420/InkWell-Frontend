import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  APP_INITIALIZER,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { routes } from './app.routes';
import { credentialsInterceptor } from './core/interceptors/credentials.interceptor';
import { AuthService } from './core/services/auth.service';

function initializeAuth(authService: AuthService, platformId: object) {
  return () => {
    if (!isPlatformBrowser(platformId)) {
      return Promise.resolve();
    }
    return authService.restoreSession();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([credentialsInterceptor])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const authService = inject(AuthService);
        const platformId = inject(PLATFORM_ID);
        return initializeAuth(authService, platformId);
      },
      multi: true,
    },
  ],
};
