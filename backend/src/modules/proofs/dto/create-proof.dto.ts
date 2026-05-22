import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProofDto {
  @IsString()
  imageKey: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  comment?: string;
}
