import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AdService } from './ad.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('ad')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Public()
  @Get('ssv-callback')
  @HttpCode(HttpStatus.OK)
  async ssvCallback(@Query() query: Record<string, string>) {
    await this.adService.handleSsvCallback(query);
    return 'OK';
  }
}
