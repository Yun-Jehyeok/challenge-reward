import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportStatus } from '../../proofs/entities/report.entity';

export class PatchReportDto {
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
