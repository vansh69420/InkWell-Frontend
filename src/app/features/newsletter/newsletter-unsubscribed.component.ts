import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-newsletter-unsubscribed',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container-sm" style="padding-top: 60px; text-align: center;">
      <div class="card" style="padding: 60px 40px;">
        <div style="font-size: 64px; margin-bottom: 20px;">👋</div>
        <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 12px;">
          Unsubscribed
        </h2>
        <p class="text-secondary" style="font-size: 16px; margin-bottom: 32px;">
          You've been removed from our newsletter. You can resubscribe anytime.
        </p>
        <a routerLink="/home" class="btn-secondary" style="padding: 14px 32px; border-radius: 12px; font-size: 15px; text-decoration: none; border: var(--border);">
          Back to Home
        </a>
      </div>
    </div>
  `
})
export class NewsletterUnsubscribedComponent {}
