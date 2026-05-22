import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { LotteryConfig } from './entities/lottery-config.entity';
import { Wallet } from '../users/entities/wallet.entity';
import { WalletTransaction } from '../wallet/entities/wallet-transaction.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { Proof } from '../proofs/entities/proof.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, LotteryConfig, Wallet, WalletTransaction, Challenge, Proof]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService, TypeOrmModule],
})
export class TicketsModule {}
