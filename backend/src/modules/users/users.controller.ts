import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto';
import { imageKeyToUrl } from '../../utils/cloudfront.util';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {}

  @Get('me')
  async getMe(@CurrentUser() user: User) {
    const wallet = await this.usersService.getWallet(user.id);
    const ticketCount = await this.ticketRepo.count({
      where: { userId: user.id, status: 'pending' as any },
    });
    const domain = this.config.get<string>('CLOUDFRONT_DOMAIN') ?? '';
    return {
      id: user.id,
      nickname: user.nickname,
      profileImageUrl: imageKeyToUrl(user.profileImageKey, domain),
      ticketCount,
      totalEarned: wallet?.totalEarned ?? 0,
      createdAt: user.createdAt,
    };
  }

  @Patch('me')
  async updateMe(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    if (!dto.nickname && !dto.profileImageKey) return {};
    const updated = await this.usersService.updateProfile(user.id, dto);
    const domain = this.config.get<string>('CLOUDFRONT_DOMAIN') ?? '';
    return {
      id: updated.id,
      nickname: updated.nickname,
      profileImageUrl: imageKeyToUrl(updated.profileImageKey, domain),
    };
  }

  @Patch('me/fcm-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateFcmToken(@CurrentUser() user: User, @Body() dto: UpdateFcmTokenDto) {
    await this.usersService.updateFcmToken(user.id, dto.fcmToken);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMe(@CurrentUser() user: User) {
    await this.usersService.softDelete(user.id);
  }
}
