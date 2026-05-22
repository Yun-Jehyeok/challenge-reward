import { IsDateString, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateChallengeDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(10000)
  maxParticipants?: number | null;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
