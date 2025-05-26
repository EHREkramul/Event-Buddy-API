import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Event } from 'src/entities/event.entity';
import { Booking } from 'src/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event, Booking])],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
