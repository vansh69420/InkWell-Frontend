import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, Tag } from '../models/taxonomy.model';

@Injectable({ providedIn: 'root' })
export class TaxonomyApiService {
  private http = inject(HttpClient);
  private base = environment.gateway;

  private categories$?: Observable<Category[]>;
  private tags$?: Observable<Tag[]>;

  getCategories(): Observable<Category[]> {
    if (!this.categories$) {
      this.categories$ = this.http
        .get<Category[]>(`${this.base}/categories`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.categories$;
  }

  getTags(): Observable<Tag[]> {
    if (!this.tags$) {
      this.tags$ = this.http
        .get<Tag[]>(`${this.base}/tags`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.tags$;
  }

  // optional helper for later (admin screens etc.)
  clearCache() {
    this.categories$ = undefined;
    this.tags$ = undefined;
  }
}
