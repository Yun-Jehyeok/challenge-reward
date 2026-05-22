import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ReportReason {
  IRRELEVANT_PHOTO = 'irrelevant_photo',
  SPAM = 'spam',
  STOLEN_PHOTO = 'stolen_photo',
  HATE_SPEECH = 'hate_speech',
}

export enum ReportStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reporter_id' })
  reporterId: string;

  @Column({ name: 'proof_id' })
  proofId: string;

  @Column({ type: 'enum', enum: ReportReason })
  reason: ReportReason;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Column({ name: 'admin_note', type: 'text', nullable: true })
  adminNote: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
