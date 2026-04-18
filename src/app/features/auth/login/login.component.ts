import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  async onSubmit(): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    try {
      await this.authService.login(this.email(), this.password());
      this.router.navigate(['/profile']);
    } catch (err: any) {
      this.errorMessage.set(
        err?.error ?? 'Login failed. Please check your credentials.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  onGoogleLogin(): void {
    this.authService.loginWithGoogle();
  }

  onGitHubLogin(): void {
    this.authService.loginWithGitHub();
  }
}
