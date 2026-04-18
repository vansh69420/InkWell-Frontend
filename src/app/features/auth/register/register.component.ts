import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = signal('');
  email = signal('');
  password = signal('');
  fullName = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  async onSubmit(): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    try {
      await this.authService.register(
        this.username(),
        this.email(),
        this.password(),
        this.fullName()
      );
      this.router.navigate(['/profile']);
    } catch (err: any) {
      this.errorMessage.set(
        err?.error ?? 'Registration failed. Please try again.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
