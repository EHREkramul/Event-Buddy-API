import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventResponseDto } from 'src/admin/events/dto/event-response.dto';
import { Booking } from 'src/entities/booking.entity';
import { Event } from 'src/entities/event.entity';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { IndividualEventResponseDto } from './dto/individual-event-response.dto';
import { SearchEventDto } from './dto/search-event.dto';

@Injectable()
export class PublicEventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
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

  async getEventDetails(eventId: number) {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Fetch sum of seatsBooked for this event
    const bookingResult = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.seatsBooked)', 'bookedCount')
      .where('booking.eventId = :eventId', { eventId })
      .getRawOne();

    const bookedCount = bookingResult?.bookedCount
      ? +bookingResult.bookedCount
      : 0;

    const availableSeats = event.totalCapacity - bookedCount;

    // Map event to response DTO with availableSeats
    return this.mapEventToResponseDtoWithAvailableSeats(event, availableSeats);
  }

  async searchEvents(searchDto: SearchEventDto): Promise<Event[]> {
    const { search } = searchDto;

    const query = this.eventsRepository.createQueryBuilder('event');

    query.where(
      `event.title ILIKE :search 
    OR event.description ILIKE :search 
    OR event.eventLocation ILIKE :search 
    OR event.eventTags ILIKE :search`,
      { search: `%${search}%` },
    );

    query.orderBy('event.eventStartDate', 'ASC');

    const events = await query.getMany();

    return events;
  }

  //---------------- Helper methods ----------------
  private mapEventToResponseDtoWithAvailableSeats(
    event: Event,
    availableSeats: number,
  ): IndividualEventResponseDto {
    const responseDto = new IndividualEventResponseDto();
    responseDto.id = event.id;
    responseDto.title = event.title;
    responseDto.description = event.description;
    responseDto.eventStartDate = event.eventStartDate;
    responseDto.eventEndDate = event.eventEndDate;
    responseDto.totalCapacity = event.totalCapacity;
    responseDto.eventLocation = event.eventLocation;
    responseDto.eventTags = event.eventTags;
    responseDto.thumbnailImage = event.thumbnailImage;
    responseDto.availableSeats = availableSeats;
    return responseDto;
  }
}
