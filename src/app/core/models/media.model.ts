export interface MediaResponse {
  mediaId: string;
  uploaderId: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  sizeKb: number;
  altText?: string | null;
  linkedPostId?: string | null;
  uploadedAt: string;
}
