import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { SanctionType } from '../../users/entities/user-sanction.entity';

export class CreateSanctionDto {
  @IsEnum(SanctionType)
  type: SanctionType;

  @IsString()
  reason: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;
}
