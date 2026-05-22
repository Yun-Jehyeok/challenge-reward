import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proof } from './entities/proof.entity';
import { ProofVote } from './entities/proof-vote.entity';
import { Report } from './entities/report.entity';
import { ChallengeParticipant } from '../challenges/entities/challenge-participant.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { ProofsController } from './proofs.controller';
import { ProofsService } from './proofs.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proof, ProofVote, Report, ChallengeParticipant, Challenge, Ticket]),
    NotificationsModule,
  ],
  controllers: [ProofsController],
  providers: [ProofsService],
  exports: [ProofsService, TypeOrmModule],
})
export class ProofsModule {}
