import { IsEnum } from 'class-validator';
import { ReportReason } from '../entities/report.entity';

export class CreateReportDto {
  @IsEnum(ReportReason)
  reason: ReportReason;
}
