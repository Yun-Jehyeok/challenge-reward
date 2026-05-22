import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../tickets/entities/ticket.entity';
import { AdController } from './ad.controller';
import { AdService } from './ad.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  controllers: [AdController],
  providers: [AdService],
})
export class AdModule {}
