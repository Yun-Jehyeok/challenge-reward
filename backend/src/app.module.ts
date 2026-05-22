import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    ThrottlerModule.forRoot([
      { ttl: 60000, limit: 100 },
    ]),

    ScheduleModule.forRoot(),

    // Feature modules (추가 예정)
    // AuthModule,
    // UsersModule,
    // ChallengesModule,
    // ProofsModule,
    // TicketsModule,
    // WalletModule,
    // UploadsModule,
    // AdModule,
    // NotificationsModule,
    // AdminModule,
  ],
})
export class AppModule {}
