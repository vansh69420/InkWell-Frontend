import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  async onSubmit(): Promise<void> {
    if (!this.email.trim() || !this.password.trim()) return;

    this.loading = true;
    this.error = null;

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (e: any) {
      this.error = e?.error ?? e?.message ?? 'Login failed.';
    } finally {
      this.loading = false;
    }
  }

  onGoogleLogin(): void {
    this.authService.loginWithGoogle();
  }

  onGitHubLogin(): void {
    this.authService.loginWithGitHub();
  }
}
