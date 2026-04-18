import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  readonly authService = inject(AuthService);

  fullName = signal('');
  email = signal('');
  bio = signal('');
  avatarUrl = signal('');

  currentPassword = signal('');
  newPassword = signal('');

  profileMessage = signal('');
  profileError = signal('');
  passwordMessage = signal('');
  passwordError = signal('');

  isProfileLoading = signal(false);
  isPasswordLoading = signal(false);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.fullName.set(user.fullName);
      this.email.set(user.email);
      this.bio.set(user.bio ?? '');
      this.avatarUrl.set(user.avatarUrl ?? '');
    }
  }

  async onUpdateProfile(): Promise<void> {
    this.profileMessage.set('');
    this.profileError.set('');
    this.isProfileLoading.set(true);

    try {
      await this.authService.updateProfile({
        fullName: this.fullName(),
        email: this.email(),
        bio: this.bio(),
        avatarUrl: this.avatarUrl(),
      });
      this.profileMessage.set('Profile updated successfully.');
    } catch (err: any) {
      this.profileError.set(err?.error ?? 'Failed to update profile.');
    } finally {
      this.isProfileLoading.set(false);
    }
  }

  async onChangePassword(): Promise<void> {
    this.passwordMessage.set('');
    this.passwordError.set('');
    this.isPasswordLoading.set(true);

    try {
      await this.authService.changePassword(
        this.currentPassword(),
        this.newPassword()
      );
      this.passwordMessage.set('Password changed successfully.');
      this.currentPassword.set('');
      this.newPassword.set('');
    } catch (err: any) {
      this.passwordError.set(err?.error ?? 'Failed to change password.');
    } finally {
      this.isPasswordLoading.set(false);
    }
  }
}
