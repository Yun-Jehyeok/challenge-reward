import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { UserSanction, SanctionType } from '../../modules/users/entities/user-sanction.entity';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ActiveUserGuard implements CanActivate {
  constructor(
    @InjectRepository(UserSanction)
    private readonly sanctionRepo: Repository<UserSanction>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) return true;

    const suspension = await this.sanctionRepo.findOne({
      where: [
        { userId: user.id, type: SanctionType.SUSPENSION, expiresAt: IsNull() },
        { userId: user.id, type: SanctionType.SUSPENSION, expiresAt: MoreThan(new Date()) },
      ],
    });

    if (suspension) throw new UnauthorizedException('계정이 정지된 상태입니다.');
    return true;
  }
}
