import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Input() isDark = false;
  @Output() themeToggle = new EventEmitter<void>();

  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  onThemeToggle(): void {
    this.themeToggle.emit();
  }

  async onLogout(): Promise<void> {
    await this.authService.logout('');
    this.router.navigate(['/login']);
  }
}
