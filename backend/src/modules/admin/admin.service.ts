import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Report } from '../proofs/entities/report.entity';
import { User } from '../users/entities/user.entity';
import { UserSanction } from '../users/entities/user-sanction.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { LotteryConfig } from '../tickets/entities/lottery-config.entity';
import { PatchReportDto } from './dto/patch-report.dto';
import { CreateSanctionDto } from './dto/create-sanction.dto';
import { PatchLotteryConfigDto } from './dto/patch-lottery-config.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Report) private readonly reportRepo: Repository<Report>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserSanction) private readonly sanctionRepo: Repository<UserSanction>,
    @InjectRepository(Challenge) private readonly challengeRepo: Repository<Challenge>,
    @InjectRepository(LotteryConfig) private readonly lotteryRepo: Repository<LotteryConfig>,
    private readonly dataSource: DataSource,
  ) {}

  async getReports(dto: PaginationDto) {
    const limit = dto.limit ?? 20;
    const qb = this.reportRepo.createQueryBuilder('r').orderBy('r.created_at', 'DESC');
    if (dto.cursor) {
      const [cursorDate, cursorId] = dto.cursor.split('_');
      qb.where('(r.created_at, r.id) < (:cursorDate::timestamptz, :cursorId)', { cursorDate, cursorId });
    }
    qb.limit(limit + 1);
    const rows = await qb.getMany();
    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit);
    const last = data[data.length - 1];
    return {
      data,
      nextCursor: hasMore && last ? `${last.createdAt.toISOString()}_${last.id}` : null,
      hasMore,
    };
  }

  async patchReport(reportId: string, dto: PatchReportDto) {
    const report = await this.reportRepo.findOne({ where: { id: reportId } });
    if (!report) throw new NotFoundException('신고를 찾을 수 없습니다.');
    await this.reportRepo.update(reportId, { status: dto.status, adminNote: dto.adminNote ?? null });
    return this.reportRepo.findOneOrFail({ where: { id: reportId } });
  }

  async getUsers(dto: PaginationDto) {
    const limit = dto.limit ?? 20;
    const qb = this.userRepo.createQueryBuilder('u')
      .where('u.deleted_at IS NULL')
      .orderBy('u.created_at', 'DESC');
    if (dto.cursor) {
      const [cursorDate, cursorId] = dto.cursor.split('_');
      qb.andWhere('(u.created_at, u.id) < (:cursorDate::timestamptz, :cursorId)', { cursorDate, cursorId });
    }
    qb.limit(limit + 1);
    const rows = await qb.getMany();
    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit).map((u) => ({
      id: u.id,
      nickname: u.nickname,
      role: u.role,
      createdAt: u.createdAt,
    }));
    const last = rows[data.length - 1];
    return {
      data,
      nextCursor: hasMore && last ? `${last.createdAt.toISOString()}_${last.id}` : null,
      hasMore,
    };
  }

  async getUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');
    const sanctions = await this.sanctionRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    return { ...user, sanctions };
  }

  async createSanction(targetUserId: string, adminId: string, dto: CreateSanctionDto) {
    const user = await this.userRepo.findOne({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');
    const sanction = await this.sanctionRepo.save({
      userId: targetUserId,
      adminId,
      type: dto.type,
      reason: dto.reason,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    });
    return { sanction };
  }

  async deleteChallenge(challengeId: string) {
    const challenge = await this.challengeRepo.findOne({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('챌린지를 찾을 수 없습니다.');
    await this.challengeRepo.softDelete(challengeId);
  }

  async getLotteryConfig() {
    return this.lotteryRepo.find({ order: { amount: 'ASC' } });
  }

  async patchLotteryConfig(dto: PatchLotteryConfigDto) {
    const total = dto.configs.reduce((sum, c) => sum + c.probability, 0);
    if (Math.abs(total - 1.0) > 1e-6) {
      throw new BadRequestException(`확률 합계가 1.0이어야 합니다. 현재: ${total.toFixed(7)}`);
    }
    return this.dataSource.transaction(async (manager) => {
      await manager.delete(LotteryConfig, {});
      return manager.save(LotteryConfig, dto.configs);
    });
  }
}
