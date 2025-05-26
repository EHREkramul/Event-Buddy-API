import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/entities/event.entity';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';

@Injectable()
export class PublicEventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async findUpcomingEvents() {
    const now = new Date();
    const upcomingEvents = this.eventsRepository.find({
      where: { eventStartDate: MoreThan(now) },
      order: { eventStartDate: 'ASC' },
    });

    if (!upcomingEvents) {
      throw new NotFoundException('No upcoming events found');
    }
    return upcomingEvents;
  }

  async findPreviousEvents() {
    const now = new Date();
    const previousEvents = this.eventsRepository.find({
      where: { eventEndDate: LessThan(now) },
      order: { eventEndDate: 'DESC' },
    });
    if (!previousEvents) {
      throw new NotFoundException('No previous events found');
    }
    return previousEvents;
  }

  async getEventDetails(id: number) {
    const event = this.eventsRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }
}
