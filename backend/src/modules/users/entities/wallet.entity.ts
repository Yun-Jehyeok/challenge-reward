import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ default: 0 })
  balance: number;

  @Column({ name: 'total_earned', default: 0 })
  totalEarned: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
