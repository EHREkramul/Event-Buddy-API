import { Module } from '@nestjs/common';
import { PublicEventsService } from './public-events.service';
import { PublicEventsController } from './public-events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Event } from 'src/entities/event.entity';
import { Booking } from 'src/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event, Booking])],
  providers: [PublicEventsService],
  controllers: [PublicEventsController],
})
export class PublicEventsModule {}
