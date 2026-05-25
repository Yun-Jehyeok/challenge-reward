import {
  BadRequestException,
  ConflictException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Challenge } from './entities/challenge.entity';
import { ChallengeParticipant } from './entities/challenge-participant.entity';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { ListChallengesDto } from './dto/list-challenges.dto';
import { toKstDateString, getDaysUntilEnd } from '../../utils/kst.util';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepo: Repository<Challenge>,
    @InjectRepository(ChallengeParticipant)
    private readonly participantRepo: Repository<ChallengeParticipant>,
    private readonly dataSource: DataSource,
  ) {}

  async listChallenges(userId: string, dto: ListChallengesDto) {
    const limit = dto.limit ?? 20;
    const qb = this.challengeRepo.createQueryBuilder('c')
      .where('c.deleted_at IS NULL');

    if (dto.keyword) {
      qb.andWhere('c.title ILIKE :keyword', { keyword: `%${dto.keyword}%` });
    }

    if (dto.cursor) {
      const [cursorDate, cursorId] = dto.cursor.split('_');
      qb.andWhere('(c.created_at, c.id) < (:cursorDate::timestamptz, :cursorId)', {
        cursorDate,
        cursorId,
      });
    }

    qb.orderBy('c.created_at', 'DESC').addOrderBy('c.id', 'DESC').limit(limit + 1);

    const rows = await qb.getMany();
    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit);
    const today = toKstDateString();

    const participantCounts = await this.participantRepo
      .createQueryBuilder('p')
      .select('p.challenge_id', 'challengeId')
      .addSelect('COUNT(*)', 'count')
      .where('p.challenge_id IN (:...ids)', { ids: data.map((c) => c.id) })
      .groupBy('p.challenge_id')
      .getRawMany<{ challengeId: string; count: string }>();

    const countMap = new Map(participantCounts.map((r) => [r.challengeId, parseInt(r.count)]));

    const myParticipations = await this.participantRepo.find({
      where: data.map((c) => ({ challengeId: c.id, userId })),
    });
    const joinedSet = new Set(myParticipations.map((p) => p.challengeId));

    const formatted = data.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      participantCount: countMap.get(c.id) ?? 0,
      startDate: c.startDate,
      endDate: c.endDate,
      isEnded: c.endDate < today,
      isJoined: joinedSet.has(c.id),
    }));

    const lastItem = data[data.length - 1];
    const nextCursor = hasMore && lastItem
      ? `${lastItem.createdAt.toISOString()}_${lastItem.id}`
      : null;

    return { data: formatted, nextCursor, hasMore };
  }

  async createChallenge(userId: string, dto: CreateChallengeDto) {
    return this.dataSource.transaction(async (manager) => {
      const challenge = manager.create(Challenge, {
        creatorId: userId,
        title: dto.title,
        description: dto.description ?? null,
        maxParticipants: dto.maxParticipants ?? null,
        startDate: dto.startDate,
        endDate: dto.endDate,
      });
      const saved = await manager.save(Challenge, challenge);
      await manager.save(ChallengeParticipant, { challengeId: saved.id, userId });
      return { challenge: this.formatChallenge(saved, 1, false, false) };
    });
  }

  async getMyChallenges(userId: string) {
    const participants = await this.participantRepo.find({ where: { userId } });
    if (!participants.length) return { data: [] };

    const challengeIds = participants.map((p) => p.challengeId);
    const challenges = await this.challengeRepo
      .createQueryBuilder('c')
      .where('c.id IN (:...ids)', { ids: challengeIds })
      .andWhere('c.deleted_at IS NULL')
      .getMany();

    const today = toKstDateString();

    const todayProofs = (await this.dataSource.query(
      `SELECT challenge_id FROM proofs WHERE user_id = $1 AND proof_date = $2`,
      [userId, today],
    )) as { challenge_id: string }[];
    const todaySet = new Set(todayProofs.map((p) => p.challenge_id));

    const participantMap = new Map(participants.map((p) => [p.challengeId, p]));

    const data = challenges.map((c) => {
      const p = participantMap.get(c.id)!;
      return {
        id: c.id,
        title: c.title,
        endDate: c.endDate,
        currentStreak: p.currentStreak,
        isTodayProofDone: todaySet.has(c.id),
        daysUntilEnd: getDaysUntilEnd(c.endDate),
        isEnded: c.endDate < today,
      };
    });

    return { data };
  }

  async getChallenge(id: string, userId: string) {
    const challenge = await this.challengeRepo.findOne({
      where: { id, deletedAt: undefined },
    });
    if (!challenge) throw new NotFoundException('챌린지를 찾을 수 없습니다.');

    const today = toKstDateString();
    const [participantCount, isJoined, todayProofRows] = await Promise.all([
      this.participantRepo.count({ where: { challengeId: id } }),
      this.participantRepo.findOne({ where: { challengeId: id, userId } }),
      this.dataSource.query(
        `SELECT id FROM proofs WHERE challenge_id = $1 AND user_id = $2 AND proof_date = $3`,
        [id, userId, today],
      ),
    ]);

    return {
      ...this.formatChallenge(challenge, participantCount, challenge.endDate < today, !!isJoined),
      isTodayProofDone: todayProofRows.length > 0,
    };
  }

  async joinChallenge(challengeId: string, userId: string) {
    const challenge = await this.challengeRepo.findOne({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('챌린지를 찾을 수 없습니다.');

    const today = toKstDateString();
    if (challenge.endDate < today) throw new GoneException('종료된 챌린지입니다.');

    const existing = await this.participantRepo.findOne({ where: { challengeId, userId } });
    if (existing) throw new ConflictException('이미 참여 중인 챌린지입니다.');

    if (challenge.maxParticipants !== null) {
      const count = await this.participantRepo.count({ where: { challengeId } });
      if (count >= challenge.maxParticipants) throw new BadRequestException('참여 인원이 초과되었습니다.');
    }

    const participant = await this.participantRepo.save({ challengeId, userId });
    return { participant };
  }

  private formatChallenge(c: Challenge, participantCount: number, isEnded: boolean, isJoined: boolean) {
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      participantCount,
      startDate: c.startDate,
      endDate: c.endDate,
      isEnded,
      isJoined,
      createdAt: c.createdAt,
    };
  }
}
