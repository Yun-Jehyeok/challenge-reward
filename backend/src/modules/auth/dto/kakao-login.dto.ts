import { IsOptional, IsString } from 'class-validator';

export class KakaoLoginDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  codeVerifier?: string;
}
