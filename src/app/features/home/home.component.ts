import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <div class="home-placeholder">
      <h1>Welcome to InkWell</h1>
      <p>Write. Publish. Connect. Inspire.</p>
    </div>
  `,
  styles: [`
    .home-placeholder {
      text-align: center;
      padding: 4rem 2rem;
      h1 { font-size: 2.5rem; color: #1a1a2e; margin-bottom: 1rem; }
      p { color: #666; font-size: 1.2rem; }
    }
  `],
})
export class HomeComponent {}
