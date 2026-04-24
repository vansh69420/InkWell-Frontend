import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MediaApiService } from '../../core/services/media-api.service';
import { MediaResponse } from '../../core/models/media.model';

@Component({
  selector: 'app-media-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './media-picker.component.html',
})
export class MediaPickerComponent implements OnInit {
  private mediaApi = inject(MediaApiService);
  private cdr = inject(ChangeDetectorRef);

  @Input() visible = false;
  @Output() selected = new EventEmitter<MediaResponse>();
  @Output() closed = new EventEmitter<void>();

  media: MediaResponse[] = [];
  loading = false;
  error: string | null = null;

  uploading = false;
  uploadError: string | null = null;
  selectedFile: File | null = null;

  pasteUrl = '';
  showPasteUrl = false;

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.mediaApi.getMyMedia().subscribe({
      next: (items) => {
        this.media = items.filter(m => m.mimeType.startsWith('image/'));
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

  selectImage(item: MediaResponse): void {
    this.selected.emit(item);
    this.close();
  }

  selectFromUrl(): void {
    if (!this.pasteUrl.trim()) return;
    const fakeMedia: MediaResponse = {
      mediaId: '',
      uploaderId: '',
      filename: '',
      originalName: 'External Image',
      url: this.pasteUrl.trim(),
      mimeType: 'image/jpeg',
      sizeKb: 0,
      uploadedAt: new Date().toISOString(),
    };
    this.selected.emit(fakeMedia);
    this.pasteUrl = '';
    this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
