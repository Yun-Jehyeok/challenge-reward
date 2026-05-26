import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Proof, ProofStatus } from './entities/proof.entity';
import { ProofVote, VoteType } from './entities/proof-vote.entity';
import { Report } from './entities/report.entity';
import { ChallengeParticipant } from '../challenges/entities/challenge-participant.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { Ticket, TicketStatus } from '../tickets/entities/ticket.entity';
import { CreateProofDto } from './dto/create-proof.dto';
import { VoteProofDto } from './dto/vote-proof.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { toKstDateString } from '../../utils/kst.util';
import { imageKeyToUrl } from '../../utils/cloudfront.util';

@Injectable()
export class ProofsService {
  constructor(
    @InjectRepository(Proof)
    private readonly proofRepo: Repository<Proof>,
    @InjectRepository(ProofVote)
    private readonly voteRepo: Repository<ProofVote>,
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
    @InjectRepository(ChallengeParticipant)
    private readonly participantRepo: Repository<ChallengeParticipant>,
    @InjectRepository(Challenge)
    private readonly challengeRepo: Repository<Challenge>,
    private readonly dataSource: DataSource,
    private readonly config: ConfigService,
  ) {}

  async uploadProof(challengeId: string, userId: string, dto: CreateProofDto) {
    const challenge = await this.challengeRepo.findOne({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('챌린지를 찾을 수 없습니다.');

    const today = toKstDateString();
    if (challenge.endDate < today) throw new BadRequestException('종료된 챌린지입니다.');

    const participant = await this.participantRepo.findOne({
      where: { challengeId, userId },
    });
    if (!participant) throw new ForbiddenException('챌린지 참여자만 인증할 수 있습니다.');

    try {
      const proof = await this.proofRepo.save({
        challengeId,
        userId,
        imageKey: dto.imageKey,
        comment: dto.comment ?? null,
        proofDate: today,
        status: ProofStatus.APPROVED,
        approvedAt: new Date(),
      });

      // streak 업로드 시점에 즉시 증가
      const newStreak = participant.currentStreak + 1;
      await this.participantRepo.update(participant.id, {
        currentStreak: newStreak,
        maxStreak: Math.max(participant.maxStreak, newStreak),
      });

      // TODO: 임시 - 단일 계정 테스트용. 추후 P2P 투표 승인(3표) 로직으로 복구 필요
      await this.proofRepo.manager.save(Ticket, {
        userId,
        proofId: proof.id,
        status: TicketStatus.PENDING,
      });

      const domain = this.config.get<string>('CLOUDFRONT_DOMAIN') ?? '';
      return {
        proof: {
          id: proof.id,
          status: proof.status,
          proofDate: proof.proofDate,
          imageUrl: imageKeyToUrl(proof.imageKey, domain),
          createdAt: proof.createdAt,
        },
      };
    } catch (e: any) {
      if (e?.code === '23505') throw new ConflictException('오늘 이미 인증했습니다.');
      throw e;
    }
  }

  async getReviewQueue(userId: string, dto: PaginationDto) {
    const limit = dto.limit ?? 20;

    // 내가 참여한 챌린지 IDs
    const myParticipations = await this.participantRepo.find({ where: { userId } });
    if (!myParticipations.length) return { data: [], nextCursor: null, hasMore: false };
    const challengeIds = myParticipations.map((p) => p.challengeId);

    const qb = this.proofRepo.createQueryBuilder('p')
      .innerJoin(Challenge, 'c', 'c.id = p.challenge_id::uuid AND c.deleted_at IS NULL')
      .innerJoin('users', 'u', 'u.id = p.user_id::uuid')
      .leftJoin(
        ProofVote,
        'pv',
        'pv.proof_id::uuid = p.id AND pv.voter_id = :userId',
        { userId },
      )
      .where('p.challenge_id IN (:...challengeIds)', { challengeIds })
      .andWhere('p.user_id != :userId', { userId })
      .andWhere('p.status = :status', { status: ProofStatus.PENDING })
      .andWhere('pv.id IS NULL')
      .select('p.id', 'id')
      .addSelect('c.title', 'challengeTitle')
      .addSelect('p.imageKey', 'imageKey')
      .addSelect('p.comment', 'comment')
      .addSelect('u.nickname', 'uploaderNickname')
      .addSelect('u.profile_image_key', 'uploaderProfileImageKey')
      .addSelect('p.createdAt', 'createdAt');

    if (dto.cursor) {
      const [cursorDate, cursorId] = dto.cursor.split('_');
      qb.andWhere('(p.created_at, p.id) < (:cursorDate::timestamptz, :cursorId)', {
        cursorDate,
        cursorId,
      });
    }

    qb.orderBy('p.created_at', 'DESC').addOrderBy('p.id', 'DESC').limit(limit + 1);

    const rows = await qb.getRawMany<{
      id: string;
      challengeTitle: string;
      imageKey: string;
      comment: string | null;
      uploaderNickname: string;
      uploaderProfileImageKey: string | null;
      createdAt: Date;
    }>();

    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit);
    const domain = this.config.get<string>('CLOUDFRONT_DOMAIN') ?? '';

    // approve/reject counts per proof
    const proofIds = data.map((r) => r.id);
    const voteCounts =
      proofIds.length > 0
        ? await this.voteRepo
            .createQueryBuilder('v')
            .select('v.proof_id', 'proofId')
            .addSelect('v.vote', 'vote')
            .addSelect('COUNT(*)', 'count')
            .where('v.proof_id IN (:...proofIds)', { proofIds })
            .groupBy('v.proof_id')
            .addGroupBy('v.vote')
            .getRawMany<{ proofId: string; vote: string; count: string }>()
        : [];

    const voteMap = new Map<string, { approve: number; reject: number }>();
    for (const row of voteCounts) {
      if (!voteMap.has(row.proofId)) voteMap.set(row.proofId, { approve: 0, reject: 0 });
      const entry = voteMap.get(row.proofId)!;
      if (row.vote === 'approve') entry.approve = parseInt(row.count);
      else entry.reject = parseInt(row.count);
    }

    const formatted = data.map((r) => ({
      id: r.id,
      challengeTitle: r.challengeTitle,
      imageUrl: imageKeyToUrl(r.imageKey, domain),
      comment: r.comment,
      uploaderNickname: r.uploaderNickname,
      uploaderProfileImageUrl: imageKeyToUrl(r.uploaderProfileImageKey, domain),
      approveCount: voteMap.get(r.id)?.approve ?? 0,
      rejectCount: voteMap.get(r.id)?.reject ?? 0,
      createdAt: r.createdAt,
    }));

    const lastItem = data[data.length - 1];
    const nextCursor = hasMore && lastItem
      ? `${lastItem.createdAt.toISOString()}_${lastItem.id}`
      : null;

    return { data: formatted, nextCursor, hasMore };
  }

  async getReviewQueueCount(userId: string): Promise<{ count: number }> {
    const myParticipations = await this.participantRepo.find({ where: { userId } });
    if (!myParticipations.length) return { count: 0 };
    const challengeIds = myParticipations.map((p) => p.challengeId);

    const count = await this.proofRepo.createQueryBuilder('p')
      .leftJoin(ProofVote, 'pv', 'pv.proof_id::uuid = p.id AND pv.voter_id = :userId', { userId })
      .where('p.challenge_id IN (:...challengeIds)', { challengeIds })
      .andWhere('p.user_id != :userId', { userId })
      .andWhere('p.status = :status', { status: ProofStatus.PENDING })
      .andWhere('pv.id IS NULL')
      .getCount();

    return { count };
  }

  async getProof(proofId: string, userId: string) {
    const proof = await this.proofRepo.findOne({ where: { id: proofId } });
    if (!proof) throw new NotFoundException('인증을 찾을 수 없습니다.');

    const [approveCount, rejectCount, myVote] = await Promise.all([
      this.voteRepo.count({ where: { proofId, vote: VoteType.APPROVE } }),
      this.voteRepo.count({ where: { proofId, vote: VoteType.REJECT } }),
      this.voteRepo.findOne({ where: { proofId, voterId: userId } }),
    ]);

    const domain = this.config.get<string>('CLOUDFRONT_DOMAIN') ?? '';
    return {
      id: proof.id,
      challengeId: proof.challengeId,
      status: proof.status,
      imageUrl: imageKeyToUrl(proof.imageKey, domain),
      comment: proof.comment,
      proofDate: proof.proofDate,
      approveCount,
      rejectCount,
      myVote: myVote?.vote ?? null,
      createdAt: proof.createdAt,
    };
  }

  async vote(proofId: string, voterId: string, dto: VoteProofDto) {
    return this.dataSource.transaction(async (manager) => {
      const proof = await manager.findOne(Proof, { where: { id: proofId } });
      if (!proof) throw new NotFoundException('인증을 찾을 수 없습니다.');

      if (proof.status !== ProofStatus.PENDING) throw new GoneException('이미 확정된 인증입니다.');
      if (proof.userId === voterId) throw new BadRequestException('자신의 인증에는 투표할 수 없습니다.');

      const isParticipant = await manager.findOne(ChallengeParticipant, {
        where: { challengeId: proof.challengeId, userId: voterId },
      });
      if (!isParticipant) throw new ForbiddenException('챌린지 참여자만 투표할 수 있습니다.');

      try {
        await manager.save(ProofVote, { proofId, voterId, vote: dto.vote });
      } catch (e: any) {
        if (e?.code === '23505') throw new ConflictException('이미 투표했습니다.');
        throw e;
      }

      const approveCount = await manager.count(ProofVote, {
        where: { proofId, vote: VoteType.APPROVE },
      });
      const rejectCount = await manager.count(ProofVote, {
        where: { proofId, vote: VoteType.REJECT },
      });

      let newStatus: ProofStatus = proof.status;

      if (approveCount >= 3) {
        newStatus = ProofStatus.APPROVED;
        await manager.update(Proof, proofId, { status: ProofStatus.APPROVED, approvedAt: new Date() });
        await manager.save(Ticket, { userId: proof.userId, proofId, status: TicketStatus.PENDING });
        // FCM 푸시: 트랜잭션 밖에서 비동기 처리 (caller에서 담당)
      } else if (rejectCount >= 3) {
        newStatus = ProofStatus.REJECTED;
        await manager.update(Proof, proofId, { status: ProofStatus.REJECTED, rejectedAt: new Date() });
        // streak 리셋
        await manager.update(
          ChallengeParticipant,
          { challengeId: proof.challengeId, userId: proof.userId },
          { currentStreak: 0 },
        );
      }

      return {
        vote: { proofId, vote: dto.vote },
        proof: { status: newStatus, approveCount, rejectCount },
        proofUserId: proof.userId,
        wasApproved: approveCount >= 3,
      };
    });
  }

  async createReport(proofId: string, reporterId: string, dto: CreateReportDto) {
    const proof = await this.proofRepo.findOne({ where: { id: proofId } });
    if (!proof) throw new NotFoundException('인증을 찾을 수 없습니다.');

    const report = await this.reportRepo.save({ reporterId, proofId, reason: dto.reason });
    return { reportId: report.id };
  }
}
