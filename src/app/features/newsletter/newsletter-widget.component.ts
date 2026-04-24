import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsletterApiService } from '../../core/services/newsletter-api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-newsletter-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter-widget.component.html',
})
export class NewsletterWidgetComponent {
  private newsletterApi = inject(NewsletterApiService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  email = '';
  fullName = '';
  loading = false;
  success = false;
  error: string | null = null;

  submit(): void {
    if (!this.email.trim()) return;

    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    const user = this.authService.currentUser();

    this.newsletterApi.subscribe({
      email: this.email.trim(),
      fullName: this.fullName.trim() || null,
      userId: user?.userId ?? null,
    }).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error ?? 'Subscription failed.';
        this.cdr.detectChanges();
      },
    });
  }
}
