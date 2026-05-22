import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    private readonly dataSource: DataSource,
  ) {}

  async findByKakaoId(kakaoId: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { kakaoId } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async createWithWallet(kakaoId: string, nickname: string): Promise<{ user: User; isNew: boolean }> {
    return this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, { kakaoId, nickname });
      const savedUser = await manager.save(User, user);
      await manager.save(Wallet, { userId: savedUser.id });
      return { user: savedUser, isNew: true };
    });
  }

  async updateRefreshToken(userId: string, token: string | null): Promise<void> {
    await this.userRepo.update(userId, { refreshToken: token });
  }

  async updateFcmToken(userId: string, fcmToken: string): Promise<void> {
    await this.userRepo.update(userId, { fcmToken });
  }

  async updateProfile(userId: string, data: { nickname?: string; profileImageKey?: string }): Promise<User> {
    await this.userRepo.update(userId, data);
    return this.userRepo.findOneOrFail({ where: { id: userId } });
  }

  async softDelete(userId: string): Promise<void> {
    await this.userRepo.softDelete(userId);
  }

  async getWallet(userId: string): Promise<Wallet | null> {
    return this.walletRepo.findOne({ where: { userId } });
  }
}
