import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum VoteType {
  APPROVE = 'approve',
  REJECT = 'reject',
}

@Entity('proof_votes')
@Index(['proofId', 'voterId'], { unique: true })
export class ProofVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'proof_id' })
  proofId: string;

  @Column({ name: 'voter_id' })
  voterId: string;

  @Column({ type: 'enum', enum: VoteType })
  vote: VoteType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
