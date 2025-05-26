import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/entities/event.entity';
import { Repository, LessThan, MoreThan } from 'typeorm';

@Injectable()
export class PublicEventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async findUpcomingEvents(page: number, limit: number) {
    const now = new Date();
    const [events, total] = await this.eventsRepository.findAndCount({
      where: { eventEndDate: MoreThan(now) },
      order: { eventStartDate: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findPreviousEvents(page: number, limit: number) {
    const now = new Date();
    const [events, total] = await this.eventsRepository.findAndCount({
      where: { eventEndDate: LessThan(now) },
      order: { eventStartDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findEventById(id: number) {
    return this.eventsRepository.findOne({ where: { id } });
  }
}
