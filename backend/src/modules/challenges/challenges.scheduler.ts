import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { Challenge } from './entities/challenge.entity';
import { ChallengeParticipant } from './entities/challenge-participant.entity';
import { Proof, ProofStatus } from '../proofs/entities/proof.entity';
import { toKstDateString } from '../../utils/kst.util';

@Injectable()
export class ChallengesScheduler {
  private readonly logger = new Logger(ChallengesScheduler.name);

  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepo: Repository<Challenge>,
    @InjectRepository(ChallengeParticipant)
    private readonly participantRepo: Repository<ChallengeParticipant>,
    @InjectRepository(Proof)
    private readonly proofRepo: Repository<Proof>,
    private readonly dataSource: DataSource,
  ) {}

  // KST 00:00 = UTC 15:00
  @Cron('0 0 15 * * *', { timeZone: 'UTC' })
  async midnightBatch() {
    this.logger.log('자정 배치 시작');
    const today = toKstDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    await this.dataSource.transaction(async (manager) => {
      // 1. 어제 종료된 챌린지의 pending proofs → rejected
      const endedChallenges = await manager.find(Challenge, {
        where: { endDate: LessThan(today) as any },
      });

      if (endedChallenges.length > 0) {
        const endedIds = endedChallenges.map((c) => c.id);
        await manager.createQueryBuilder()
          .update(Proof)
          .set({ status: ProofStatus.REJECTED, rejectedAt: new Date() })
          .where('challenge_id IN (:...ids)', { ids: endedIds })
          .andWhere('status = :status', { status: ProofStatus.PENDING })
          .execute();
      }

      // 2. 어제 인증 없는 참여자 current_streak = 0
      await manager.createQueryBuilder()
        .update(ChallengeParticipant)
        .set({ currentStreak: 0 })
        .where(`id NOT IN (
          SELECT DISTINCT cp.id FROM challenge_participants cp
          INNER JOIN proofs p ON p.challenge_id = cp.challenge_id AND p.user_id = cp.user_id
          WHERE p.proof_date = :yesterday
        )`, { yesterday: yesterdayStr })
        .andWhere('current_streak > 0')
        .execute();
    });

    this.logger.log('자정 배치 완료');
  }
}
