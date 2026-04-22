import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly baseUrl = `${environment.gateway}/auth`;

  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal(false);
  readonly sessionRestored = signal(false);
  readonly isServer = signal(false);

  async restoreSession(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      this.isServer.set(true);
      this.sessionRestored.set(true);
      return;
    }

    try {
      const user = await firstValueFrom(
        this.http.get<User>(`${this.baseUrl}/profile`)
      );
      this.currentUser.set(user);
    } catch {
      this.currentUser.set(null);
    } finally {
      this.sessionRestored.set(true);
    }
  }

  async login(email: string, password: string): Promise<void> {
    this.isLoading.set(true);
    try {
      await firstValueFrom(
        this.http.post(`${this.baseUrl}/login`, { email, password })
      );
      await this.restoreSession();
    } finally {
      this.isLoading.set(false);
    }
  }

  async register(
    username: string,
    email: string,
    password: string,
    fullName: string
  ): Promise<void> {
    this.isLoading.set(true);
    try {
      await firstValueFrom(
        this.http.post(`${this.baseUrl}/register`, {
          username,
          email,
          password,
          fullName,
        })
      );
      await this.restoreSession();
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.baseUrl}/logout`, { refreshToken })
      );
    } finally {
      this.currentUser.set(null);
      this.sessionRestored.set(false);
    }
  }

  async updateProfile(data: {
    fullName: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
  }): Promise<void> {
    await firstValueFrom(
      this.http.put(`${this.baseUrl}/profile`, data)
    );
    await this.restoreSession();
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await firstValueFrom(
      this.http.put(`${this.baseUrl}/password`, {
        currentPassword,
        newPassword,
      })
    );
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }

  loginWithGoogle(): void {
    window.location.href = `${this.baseUrl}/oauth/google`;
  }

  loginWithGitHub(): void {
    window.location.href = `${this.baseUrl}/oauth/github`;
  }
}
