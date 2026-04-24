import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MediaApiService } from '../../core/services/media-api.service';
import { MediaResponse } from '../../core/models/media.model';

@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './media-library.component.html',
})
export class MediaLibraryComponent implements OnInit {
  private mediaApi = inject(MediaApiService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  error: string | null = null;
  media: MediaResponse[] = [];

  uploading = false;
  uploadError: string | null = null;
  selectedFile: File | null = null;

  editingAltTextId: string | null = null;
  altTextValue = '';

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.mediaApi.getMyMedia().subscribe({
      next: (items) => {
        this.media = items;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load media.';
        this.cdr.detectChanges();
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.cdr.detectChanges();
    }
  }

  upload(): void {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.uploadError = null;
    this.cdr.detectChanges();

    this.mediaApi.upload(this.selectedFile).subscribe({
      next: (item) => {
        this.media = [item, ...this.media];
        this.selectedFile = null;
        this.uploading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        this.uploading = false;
        this.uploadError = e?.error ?? 'Upload failed.';
        this.cdr.detectChanges();
      },
    });
  }

  startEditAltText(item: MediaResponse): void {
    this.editingAltTextId = item.mediaId;
    this.altTextValue = item.altText ?? '';
    this.cdr.detectChanges();
  }

  saveAltText(mediaId: string): void {
    this.mediaApi.updateAltText(mediaId, this.altTextValue || null).subscribe({
      next: (updated) => {
        this.media = this.media.map(m =>
          m.mediaId === mediaId ? updated : m
        );
        this.editingAltTextId = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      },
    });
  }

  cancelEditAltText(): void {
    this.editingAltTextId = null;
    this.altTextValue = '';
    this.cdr.detectChanges();
  }

  copyUrl(url: string): void {
    navigator.clipboard.writeText(url);
  }

  delete(mediaId: string): void {
    if (!confirm('Delete this file?')) return;

    this.mediaApi.delete(mediaId).subscribe({
      next: () => {
        this.media = this.media.filter(m => m.mediaId !== mediaId);
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  formatSize(sizeKb: number): string {
    if (sizeKb < 1024) return `${sizeKb} KB`;
    return `${(sizeKb / 1024).toFixed(1)} MB`;
  }
}
