import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserBookingsModule } from './user-bookings/user-bookings.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserBookingsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
