import { Component, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('inkwell-frontend');

  private platformId = inject(PLATFORM_ID);
  isDark = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('inkwell-theme');
      if (stored === 'dark') {
        this.isDark.set(true);
        document.documentElement.classList.add('dark');
      } else if (stored === 'light') {
        this.isDark.set(false);
        document.documentElement.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDark.set(prefersDark);
        if (prefersDark) document.documentElement.classList.add('dark');
      }
    }

    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      if (this.isDark()) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('inkwell-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('inkwell-theme', 'light');
      }
    });
  }

  toggleTheme(): void {
    this.isDark.set(!this.isDark());
  }
}
