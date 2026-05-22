import { IsEnum, IsString } from 'class-validator';

export enum UploadPurpose {
  PROOF = 'proof',
  PROFILE = 'profile',
}

export enum AllowedContentType {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
}

export class PresignedUrlDto {
  @IsEnum(UploadPurpose)
  purpose: UploadPurpose;

  @IsEnum(AllowedContentType)
  contentType: AllowedContentType;
}
