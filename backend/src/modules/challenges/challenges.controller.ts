import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { ListChallengesDto } from './dto/list-challenges.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  list(@CurrentUser() user: User, @Query() dto: ListChallengesDto) {
    return this.challengesService.listChallenges(user.id, dto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: User, @Body() dto: CreateChallengeDto) {
    return this.challengesService.createChallenge(user.id, dto);
  }

  @Get('my')
  getMy(@CurrentUser() user: User) {
    return this.challengesService.getMyChallenges(user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.challengesService.getChallenge(id, user.id);
  }

  @Post(':id/join')
  @HttpCode(HttpStatus.CREATED)
  join(@Param('id') id: string, @CurrentUser() user: User) {
    return this.challengesService.joinChallenge(id, user.id);
  }
}
