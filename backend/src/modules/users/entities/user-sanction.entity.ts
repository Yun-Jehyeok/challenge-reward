import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum SanctionType {
  WARNING = 'warning',
  RESTRICTION = 'restriction',
  SUSPENSION = 'suspension',
}

@Entity('user_sanctions')
export class UserSanction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'admin_id' })
  adminId: string;

  @Column({ type: 'enum', enum: SanctionType })
  type: SanctionType;

  @Column({ type: 'text' })
  reason: string;

  @Column({ name: 'expires_at', nullable: true, type: 'timestamptz' })
  expiresAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
