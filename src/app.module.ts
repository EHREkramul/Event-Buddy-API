import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './admin/events/events.module';
import { PublicEventsModule } from './events/public-events/public-events.module';
import dbConfig from './auth/config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig,
    }),
    UserModule,
    AuthModule,
    EventsModule,
    PublicEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
