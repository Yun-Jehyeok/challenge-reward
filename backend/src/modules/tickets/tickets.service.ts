import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { LotteryConfig } from './entities/lottery-config.entity';
import { Wallet } from '../users/entities/wallet.entity';
import { WalletTransaction } from '../wallet/entities/wallet-transaction.entity';
import { ListTicketsDto } from './dto/list-tickets.dto';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(LotteryConfig)
    private readonly lotteryRepo: Repository<LotteryConfig>,
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private readonly txRepo: Repository<WalletTransaction>,
    private readonly dataSource: DataSource,
  ) {}

  async listTickets(userId: string, dto: ListTicketsDto) {
    const limit = dto.limit ?? 20;
    const params: unknown[] = [userId];
    const conditions: string[] = ['t.user_id = $1'];

    if (dto.status) {
      params.push(dto.status);
      conditions.push(`t.status::text = $${params.length}`);
    }

    if (dto.cursor) {
      const [cursorDate, cursorId] = dto.cursor.split('_');
      params.push(cursorDate);
      params.push(cursorId);
      conditions.push(
        `(t.created_at, t.id) < ($${params.length - 1}::timestamptz, $${params.length})`,
      );
    }

    params.push(limit + 1);

    const sql = `SELECT t.id,
              t.status,
              t.reward_amount  AS "rewardAmount",
              c.title          AS "challengeTitle",
              t.created_at     AS "createdAt"
       FROM   tickets t
       LEFT   JOIN proofs     p ON p.id = t.proof_id::uuid
       LEFT   JOIN challenges c ON c.id = p.challenge_id::uuid
       WHERE  ${conditions.join(' AND ')}
       ORDER  BY t.created_at DESC, t.id DESC
       LIMIT  $${params.length}`;

    this.logger.debug(`listTickets SQL: ${sql}`);
    this.logger.debug(`listTickets params: ${JSON.stringify(params)}`);

    let rows: {
      id: string;
      status: TicketStatus;
      rewardAmount: number | null;
      challengeTitle: string | null;
      createdAt: Date;
    }[];

    try {
      rows = await this.dataSource.query(sql, params);
    } catch (e) {
      this.logger.error(`listTickets query error: ${e}`);
      throw e;
    }

    this.logger.debug(`listTickets result count: ${rows.length}`);

    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit);
    const lastItem = data[data.length - 1];
    const nextCursor =
      hasMore && lastItem ? `${new Date(lastItem.createdAt).toISOString()}_${lastItem.id}` : null;

    return { data, nextCursor, hasMore };
  }

  async getTicket(ticketId: string, userId: string) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId, userId } });
    if (!ticket) throw new NotFoundException('복권을 찾을 수 없습니다.');
    return { id: ticket.id, status: ticket.status, rewardAmount: ticket.rewardAmount };
  }

  async scratchTicket(ticketId: string, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const ticket = await manager.findOne(Ticket, { where: { id: ticketId, userId } });
      if (!ticket) throw new NotFoundException('복권을 찾을 수 없습니다.');
      if (ticket.status === TicketStatus.SCRATCHED)
        throw new ConflictException('이미 스크래치한 복권입니다.');
      if (ticket.status !== TicketStatus.AD_COMPLETED)
        throw new BadRequestException('광고를 먼저 시청해주세요.');

      const configs = await manager.find(LotteryConfig, { order: { probability: 'ASC' } });
      const rewardAmount = this.pickReward(configs);

      await manager.update(Ticket, ticketId, {
        status: TicketStatus.SCRATCHED,
        rewardAmount,
        scratchedAt: new Date(),
      });

      const wallet = await manager.findOne(Wallet, { where: { userId } });
      if (!wallet) throw new NotFoundException('지갑을 찾을 수 없습니다.');

      const newBalance = wallet.balance + rewardAmount;
      const newTotalEarned = wallet.totalEarned + rewardAmount;
      await manager.update(Wallet, wallet.id, { balance: newBalance, totalEarned: newTotalEarned });
      await manager.save(WalletTransaction, {
        walletId: wallet.id,
        ticketId,
        amount: rewardAmount,
        type: 'earn',
      });

      return {
        rewardAmount,
        ticket: { id: ticketId, status: TicketStatus.SCRATCHED, scratchedAt: new Date() },
        wallet: { balance: newBalance, totalEarned: newTotalEarned },
      };
    });
  }

  private pickReward(configs: LotteryConfig[]): number {
    const rand = Math.random();
    let cumulative = 0;
    for (const cfg of configs) {
      cumulative += Number(cfg.probability);
      if (rand < cumulative) return cfg.amount;
    }
    return configs[configs.length - 1]?.amount ?? 1;
  }
}
