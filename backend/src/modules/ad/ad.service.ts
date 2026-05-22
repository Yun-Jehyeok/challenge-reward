import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as crypto from 'crypto';
import { Ticket, TicketStatus } from '../tickets/entities/ticket.entity';

interface SsvQuery {
  ad_network?: string;
  ad_unit?: string;
  custom_data?: string;
  key_id?: string;
  reward_amount?: string;
  reward_item?: string;
  timestamp?: string;
  transaction_id?: string;
  user_id?: string;
  signature?: string;
}

interface AdMobKeySet {
  keys: Array<{ keyId: number; pem: string; base64: string }>;
}

@Injectable()
export class AdService {
  private readonly logger = new Logger(AdService.name);
  private cachedKeys: AdMobKeySet | null = null;
  private keysCachedAt = 0;
  private readonly KEY_CACHE_TTL = 3600 * 1000; // 1시간

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {}

  async handleSsvCallback(query: SsvQuery): Promise<void> {
    try {
      const verified = await this.verifySignature(query);
      if (!verified) {
        this.logger.warn(`SSV signature verification failed for transaction_id=${query.transaction_id}`);
        return;
      }

      const ticketId = query.custom_data;
      const transactionId = query.transaction_id;
      if (!ticketId || !transactionId) return;

      const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
      if (!ticket || ticket.status !== TicketStatus.PENDING) return;

      try {
        await this.ticketRepo.update(ticket.id, {
          status: TicketStatus.AD_COMPLETED,
          adSsvToken: transactionId,
        });
      } catch (e: any) {
        // UNIQUE violation: 중복 transaction_id 처리 차단
        if (e?.code === '23505') {
          this.logger.warn(`Duplicate SSV transaction_id: ${transactionId}`);
        } else {
          throw e;
        }
      }
    } catch (err) {
      this.logger.error('SSV callback error', err);
    }
  }

  private async verifySignature(query: SsvQuery): Promise<boolean> {
    try {
      const { signature, key_id, ...rest } = query;
      if (!signature || !key_id) return false;

      // 서명 대상 쿼리 문자열: signature와 key_id 제외, 나머지 알파벳 순 정렬
      const sortedParams = Object.entries(rest)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('&');

      const keys = await this.getAdMobKeys();
      const keyObj = keys.keys.find((k) => String(k.keyId) === String(key_id));
      if (!keyObj) return false;

      const sigBuffer = Buffer.from(signature, 'base64');
      const verify = crypto.createVerify('SHA256');
      verify.update(sortedParams);
      return verify.verify(keyObj.pem, sigBuffer);
    } catch (err) {
      this.logger.error('Signature verification error', err);
      return false;
    }
  }

  private async getAdMobKeys(): Promise<AdMobKeySet> {
    const now = Date.now();
    if (this.cachedKeys && now - this.keysCachedAt < this.KEY_CACHE_TTL) {
      return this.cachedKeys;
    }
    const url = this.config.get<string>('ADMOB_SSV_PUBLIC_KEYS_URL') ??
      'https://www.gstatic.com/admob/reward/verifier-keys.json';
    const res = await axios.get<AdMobKeySet>(url);
    this.cachedKeys = res.data;
    this.keysCachedAt = now;
    return this.cachedKeys;
  }
}
