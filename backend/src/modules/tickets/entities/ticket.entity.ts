import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TicketStatus {
  PENDING = 'pending',
  AD_COMPLETED = 'ad_completed',
  SCRATCHED = 'scratched',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'proof_id' })
  proofId: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.PENDING })
  status: TicketStatus;

  @Column({ name: 'ad_ssv_token', nullable: true, type: 'varchar', unique: true })
  adSsvToken: string | null;

  @Column({ name: 'reward_amount', nullable: true, type: 'integer' })
  rewardAmount: number | null;

  @Column({ name: 'scratched_at', nullable: true, type: 'timestamptz' })
  scratchedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
