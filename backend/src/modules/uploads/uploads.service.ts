import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { PresignedUrlDto, UploadPurpose } from './dto/presigned-url.dto';

@Injectable()
export class UploadsService {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.s3 = new S3Client({
      region: config.get<string>('AWS_REGION') ?? 'ap-northeast-2',
      credentials: {
        accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID') ?? '',
        secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
      },
    });
    this.bucket = config.get<string>('S3_BUCKET_NAME') ?? '';
  }

  async getPresignedUrl(dto: PresignedUrlDto) {
    const ext = dto.contentType.split('/')[1];
    const folder = dto.purpose === UploadPurpose.PROOF ? 'proofs' : 'profiles';
    const fileKey = `${folder}/${uuidv4()}.${ext}`;
    const expiresIn = 300; // 5분

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      ContentType: dto.contentType,
    });

    const presignedUrl = await getSignedUrl(this.s3, command, { expiresIn });
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    return { presignedUrl, fileKey, expiresAt };
  }
}
