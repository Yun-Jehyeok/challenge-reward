import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../users/entities/wallet.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { Proof } from '../proofs/entities/proof.entity';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletTransaction, Challenge, Proof])],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
