import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  fullName = '';
  loading = false;
  error: string | null = null;

  async onSubmit(): Promise<void> {
    if (!this.username.trim() || !this.email.trim() ||
        !this.password.trim() || !this.fullName.trim()) return;

    this.loading = true;
    this.error = null;

    try {
      await this.authService.register(
        this.username, this.email, this.password, this.fullName
      );
      this.router.navigate(['/home']);
    } catch (e: any) {
      this.error = e?.error ?? e?.message ?? 'Registration failed.';
    } finally {
      this.loading = false;
    }
  }
}
