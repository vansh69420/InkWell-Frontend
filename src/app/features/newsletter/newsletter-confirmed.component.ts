import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-newsletter-confirmed',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="text-align:center;padding-top:60px;">
      <div style="font-size:48px;margin-bottom:16px;">🎉</div>
      <h2>You are subscribed!</h2>
      <p class="muted">Thank you for subscribing to InkWell newsletter.</p>
      <a routerLink="/home" class="btn" style="display:inline-block;margin-top:16px;">
        Back to Home
      </a>
    </div>
  `
})
export class NewsletterConfirmedComponent {}
