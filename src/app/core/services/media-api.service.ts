import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MediaResponse } from '../models/media.model';

@Injectable({ providedIn: 'root' })
export class MediaApiService {
  private http = inject(HttpClient);
  private base = environment.gateway;

  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MediaResponse>(
      `${this.base}/media/upload`, formData
    );
  }

  getMyMedia() {
    return this.http.get<MediaResponse[]>(`${this.base}/media/my`);
  }

  getAll() {
    return this.http.get<MediaResponse[]>(`${this.base}/media/all`);
  }

  updateAltText(mediaId: string, altText: string | null) {
    return this.http.put<MediaResponse>(
      `${this.base}/media/${mediaId}/alt-text`,
      { altText }
    );
  }

  delete(mediaId: string) {
    return this.http.delete<void>(`${this.base}/media/${mediaId}`);
  }

  linkToPost(mediaId: string, linkedPostId: string | null) {
    return this.http.put<MediaResponse>(
      `${this.base}/media/${mediaId}/link-post`,
      { linkedPostId }
    );
  }
}
