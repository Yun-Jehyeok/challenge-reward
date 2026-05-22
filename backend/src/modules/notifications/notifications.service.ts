import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private initialized = false;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  onModuleInit() {
    const projectId = this.config.get<string>('FCM_PROJECT_ID');
    const clientEmail = this.config.get<string>('FCM_CLIENT_EMAIL');
    const privateKey = this.config.get<string>('FCM_PRIVATE_KEY');

    if (projectId && clientEmail && privateKey && !admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
      this.initialized = true;
    } else {
      this.logger.warn('Firebase Admin SDK not initialized (missing env vars)');
    }
  }

  async sendToUser(userId: string, title: string, body: string): Promise<void> {
    if (!this.initialized) return;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user?.fcmToken) return;

    try {
      await admin.messaging().send({ token: user.fcmToken, notification: { title, body } });
    } catch (err) {
      this.logger.error(`FCM send failed for user ${userId}: ${err}`);
    }
  }
}
