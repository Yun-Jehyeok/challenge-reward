import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PatchReportDto } from './dto/patch-report.dto';
import { CreateSanctionDto } from './dto/create-sanction.dto';
import { PatchLotteryConfigDto } from './dto/patch-lottery-config.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('reports')
  getReports(@Query() dto: PaginationDto) {
    return this.adminService.getReports(dto);
  }

  @Patch('reports/:id')
  patchReport(@Param('id') id: string, @Body() dto: PatchReportDto) {
    return this.adminService.patchReport(id, dto);
  }

  @Get('users')
  getUsers(@Query() dto: PaginationDto) {
    return this.adminService.getUsers(dto);
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Post('users/:id/sanctions')
  @HttpCode(HttpStatus.CREATED)
  createSanction(
    @Param('id') id: string,
    @CurrentUser() admin: User,
    @Body() dto: CreateSanctionDto,
  ) {
    return this.adminService.createSanction(id, admin.id, dto);
  }

  @Delete('challenges/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteChallenge(@Param('id') id: string) {
    return this.adminService.deleteChallenge(id);
  }

  @Get('lottery-config')
  getLotteryConfig() {
    return this.adminService.getLotteryConfig();
  }

  @Patch('lottery-config')
  patchLotteryConfig(@Body() dto: PatchLotteryConfigDto) {
    return this.adminService.patchLotteryConfig(dto);
  }
}
