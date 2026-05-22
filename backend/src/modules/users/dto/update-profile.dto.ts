import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  nickname?: string;

  @IsOptional()
  @IsString()
  profileImageKey?: string;
}
