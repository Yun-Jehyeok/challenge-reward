import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './entities/challenge.entity';
import { ChallengeParticipant } from './entities/challenge-participant.entity';
import { Proof } from '../proofs/entities/proof.entity';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ChallengesScheduler } from './challenges.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge, ChallengeParticipant, Proof])],
  controllers: [ChallengesController],
  providers: [ChallengesService, ChallengesScheduler],
  exports: [ChallengesService, TypeOrmModule],
})
export class ChallengesModule {}
