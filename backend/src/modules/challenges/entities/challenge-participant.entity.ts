import { Column, Entity, Index, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('challenge_participants')
@Index(['challengeId', 'userId'], { unique: true })
export class ChallengeParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'challenge_id' })
  challengeId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'current_streak', default: 0 })
  currentStreak: number;

  @Column({ name: 'max_streak', default: 0 })
  maxStreak: number;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
