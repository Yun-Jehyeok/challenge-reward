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
import { ProofsService } from './proofs.service';
import { CreateProofDto } from './dto/create-proof.dto';
import { VoteProofDto } from './dto/vote-proof.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Controller()
export class ProofsController {
  constructor(
    private readonly proofsService: ProofsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post('challenges/:challengeId/proofs')
  @HttpCode(HttpStatus.CREATED)
  uploadProof(
    @Param('challengeId') challengeId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateProofDto,
  ) {
    return this.proofsService.uploadProof(challengeId, user.id, dto);
  }

  @Get('proofs/review-queue')
  getReviewQueue(@CurrentUser() user: User, @Query() dto: PaginationDto) {
    return this.proofsService.getReviewQueue(user.id, dto);
  }

  @Get('proofs/review-queue/count')
  getReviewQueueCount(@CurrentUser() user: User) {
    return this.proofsService.getReviewQueueCount(user.id);
  }

  @Get('proofs/:id')
  getProof(@Param('id') id: string, @CurrentUser() user: User) {
    return this.proofsService.getProof(id, user.id);
  }

  @Post('proofs/:id/votes')
  @HttpCode(HttpStatus.CREATED)
  async vote(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: VoteProofDto,
  ) {
    const result = await this.proofsService.vote(id, user.id, dto);
    if (result.wasApproved) {
      // 트랜잭션 밖 비동기 발송 — 실패해도 메인 로직 영향 없음
      this.notificationsService
        .sendToUser(result.proofUserId, '복권이 도착했어요! 🎫', '인증이 승인되었습니다. 복권을 긁어보세요!')
        .catch(() => {});
    }
    const { proofUserId: _p, wasApproved: _w, ...response } = result;
    return response;
  }

  @Post('proofs/:id/reports')
  @HttpCode(HttpStatus.CREATED)
  createReport(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: CreateReportDto,
  ) {
    return this.proofsService.createReport(id, user.id, dto);
  }
}
