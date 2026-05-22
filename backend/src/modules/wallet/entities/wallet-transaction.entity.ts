import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wallet_transactions')
export class WalletTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'wallet_id' })
  walletId: string;

  @Column({ name: 'ticket_id' })
  ticketId: string;

  @Column()
  amount: number;

  @Column({ default: 'earn' })
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
