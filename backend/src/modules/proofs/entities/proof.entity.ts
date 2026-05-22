import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum ProofStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('proofs')
@Index(['challengeId', 'userId', 'proofDate'], { unique: true })
export class Proof {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'challenge_id' })
  challengeId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'image_key' })
  imageKey: string;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ type: 'enum', enum: ProofStatus, default: ProofStatus.PENDING })
  status: ProofStatus;

  @Column({ name: 'proof_date', type: 'date' })
  proofDate: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'approved_at', nullable: true, type: 'timestamptz' })
  approvedAt: Date | null;

  @Column({ name: 'rejected_at', nullable: true, type: 'timestamptz' })
  rejectedAt: Date | null;
}
