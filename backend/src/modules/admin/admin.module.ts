import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../proofs/entities/report.entity';
import { User } from '../users/entities/user.entity';
import { UserSanction } from '../users/entities/user-sanction.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { LotteryConfig } from '../tickets/entities/lottery-config.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report, User, UserSanction, Challenge, LotteryConfig])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
