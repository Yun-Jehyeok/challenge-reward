import client from '../client';

export type UploadPurpose = 'proof' | 'profile';
export type UploadContentType = 'image/jpeg' | 'image/png' | 'image/webp';

export interface PresignedUrlResponse {
  presignedUrl: string;
  fileKey: string;
  expiresAt: string;
}

export const uploadsApi = {
  getPresignedUrl: (purpose: UploadPurpose, contentType: UploadContentType) =>
    client.post<PresignedUrlResponse>('/uploads/presigned-url', { purpose, contentType }),
};
