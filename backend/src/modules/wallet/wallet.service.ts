import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../users/entities/wallet.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { Proof } from '../proofs/entities/proof.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private readonly txRepo: Repository<WalletTransaction>,
  ) {}

  async getWallet(userId: string) {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) throw new NotFoundException('지갑을 찾을 수 없습니다.');
    return { balance: wallet.balance, totalEarned: wallet.totalEarned };
  }

  async getTransactions(userId: string, dto: PaginationDto) {
    const limit = dto.limit ?? 20;

    const wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) return { data: [], nextCursor: null, hasMore: false };

    const qb = this.txRepo.createQueryBuilder('tx')
      .leftJoin(Proof, 'p', 'p.id = tx.ticket_id')
      .leftJoin(Challenge, 'c', 'c.id = p.challenge_id')
      .where('tx.wallet_id = :walletId', { walletId: wallet.id })
      .select([
        'tx.id AS id',
        'tx.amount AS amount',
        'tx.type AS type',
        'c.title AS "challengeTitle"',
        'tx.created_at AS "createdAt"',
      ]);

    if (dto.cursor) {
      const [cursorDate, cursorId] = dto.cursor.split('_');
      qb.andWhere('(tx.created_at, tx.id) < (:cursorDate::timestamptz, :cursorId)', {
        cursorDate,
        cursorId,
      });
    }

    qb.orderBy('tx.created_at', 'DESC').addOrderBy('tx.id', 'DESC').limit(limit + 1);

    const rows = await qb.getRawMany<{
      id: string;
      amount: number;
      type: string;
      challengeTitle: string | null;
      createdAt: Date;
    }>();

    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit);
    const lastItem = data[data.length - 1];
    const nextCursor = hasMore && lastItem
      ? `${lastItem.createdAt.toISOString()}_${lastItem.id}`
      : null;

    return { data, nextCursor, hasMore };
  }
}
