import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-newsletter-confirmed',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container-sm" style="padding-top: 60px; text-align: center;">
      <div class="card" style="padding: 60px 40px;">
        <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
        <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 12px;">
          You're subscribed!
        </h2>
        <p class="text-secondary" style="font-size: 16px; margin-bottom: 32px;">
          Welcome to InkWell newsletter. You'll receive updates when new posts are published.
        </p>
        <a routerLink="/home" class="btn-gradient" style="padding: 14px 32px; border-radius: 12px; font-size: 15px; text-decoration: none;">
          Explore Posts →
        </a>
      </div>
    </div>
  `
})
export class NewsletterConfirmedComponent {}
