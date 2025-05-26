import { Module } from '@nestjs/common';
import { UserBookingsService } from './user-bookings.service';
import { UserBookingsController } from './user-bookings.controller';
import { Event } from 'src/entities/event.entity';
import { User } from 'src/entities/user.entity';
import { Booking } from 'src/entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event, Booking])],
  providers: [UserBookingsService],
  controllers: [UserBookingsController],
})
export class UserBookingsModule {}
