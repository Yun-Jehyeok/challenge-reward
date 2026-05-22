import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { ListTicketsDto } from './dto/list-tickets.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  listTickets(@CurrentUser() user: User, @Query() dto: ListTicketsDto) {
    return this.ticketsService.listTickets(user.id, dto);
  }

  @Get(':id')
  getTicket(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ticketsService.getTicket(id, user.id);
  }

  @Post(':id/scratch')
  @HttpCode(HttpStatus.OK)
  scratchTicket(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ticketsService.scratchTicket(id, user.id);
  }
}
