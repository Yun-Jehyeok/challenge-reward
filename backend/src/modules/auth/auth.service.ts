import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { imageKeyToUrl } from '../../utils/cloudfront.util';

interface KakaoUserInfo {
  id: number;
  kakao_account?: {
    profile?: {
      nickname?: string;
    };
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async kakaoLogin(kakaoAccessToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
    user: ReturnType<AuthService['formatUser']>;
  }> {
    const kakaoUser = await this.getKakaoUserInfo(kakaoAccessToken);
    const kakaoId = String(kakaoUser.id);
    const kakaoNickname = kakaoUser.kakao_account?.profile?.nickname ?? `user_${kakaoId.slice(-6)}`;

    let user = await this.usersService.findByKakaoId(kakaoId);
    let isNewUser = false;

    if (!user) {
      const result = await this.usersService.createWithWallet(kakaoId, kakaoNickname);
      user = result.user;
      isNewUser = result.isNew;
    }

    const { accessToken, refreshToken } = await this.issueTokens(user);
    return { accessToken, refreshToken, isNewUser, user: this.formatUser(user) };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: { sub: string; type: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    if (payload.type !== 'refresh') throw new UnauthorizedException();

    const user = await this.usersService.findById(payload.sub);
    if (!user || user.deletedAt || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    return this.issueTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  private async issueTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
    });
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '30d',
      },
    );
    await this.usersService.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  private async getKakaoUserInfo(accessToken: string): Promise<KakaoUserInfo> {
    const res = await axios.get<KakaoUserInfo>('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data;
  }

  formatUser(user: User) {
    const domain = this.config.get<string>('CLOUDFRONT_DOMAIN') ?? '';
    return {
      id: user.id,
      nickname: user.nickname,
      profileImageUrl: imageKeyToUrl(user.profileImageKey, domain),
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
