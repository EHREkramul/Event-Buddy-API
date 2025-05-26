import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException, // Import for file operation errors
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from 'src/entities/event.entity';
import { EventResponseDto } from './dto/event-response.dto';
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { Booking } from 'src/entities/booking.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async createEvent(
    createeventDto: CreateEventDto,
    userId: number,
    file?: Express.Multer.File,
  ) {
    // check if totalCapacity is a valid number and greater than 0
    if (
      createeventDto.totalCapacity &&
      (isNaN(createeventDto.totalCapacity) || createeventDto.totalCapacity <= 0)
    ) {
      throw new BadRequestException(
        'Total capacity must be a valid number greater than 0.',
      );
    }

    // Check if enddate is before or equal to start date
    if (
      createeventDto.eventEndDate &&
      createeventDto.eventStartDate &&
      createeventDto.eventEndDate <= createeventDto.eventStartDate
    ) {
      throw new BadRequestException(
        'Event end date must be after the start date.',
      );
    }

    // Check if event tags contains other than small letters and commas
    if (
      createeventDto.eventTags &&
      !/^[a-z,]+$/.test(createeventDto.eventTags)
    ) {
      throw new BadRequestException(
        'Event tags must contain only small letters and commas.',
      );
    }

    // Check if event with the same title already exists
    const existingEvent = await this.eventRepository.findOne({
      where: { title: createeventDto.title },
    });
    if (existingEvent) {
      throw new ForbiddenException(
        `Event with title "${createeventDto.title}" already exists.`,
      );
    }

    const event = this.eventRepository.create({
      ...createeventDto,
      createdBy: { id: userId },
    });

    const savedEvent = await this.eventRepository.save(event);

    if (file) {
      const ext = extname(file.originalname);
      const newFileName = `${savedEvent.id}${ext}`;
      const oldPath = file.path;
      const newPath = join('./public/uploads/event-images', newFileName);

      try {
        await fs.rename(oldPath, newPath);
      } catch (error) {
        throw new InternalServerErrorException(`Failed to save event image`);
      }

      savedEvent.thumbnailImage = newFileName;
      await this.eventRepository.save(savedEvent);
    }

    return this.mapEventToResponseDto(savedEvent);
  }

  async updateEvent(
    eventId: number,
    updateEventDto: UpdateEventDto,
    file?: Express.Multer.File,
  ) {
    // check if totalCapacity is a valid number and greater than 0
    if (
      updateEventDto.totalCapacity &&
      (isNaN(updateEventDto.totalCapacity) || updateEventDto.totalCapacity <= 0)
    ) {
      throw new BadRequestException(
        'Total capacity must be a valid number greater than 0.',
      );
    }

    // Check if enddate is before or equal to start date
    if (
      updateEventDto.eventEndDate &&
      updateEventDto.eventStartDate &&
      updateEventDto.eventEndDate <= updateEventDto.eventStartDate
    ) {
      throw new BadRequestException(
        'Event end date must be after the start date.',
      );
    }

    // Check if event tags contains other than small letters and commas
    if (
      updateEventDto.eventTags &&
      !/^[a-z,]+$/.test(updateEventDto.eventTags)
    ) {
      throw new BadRequestException(
        'Event tags must contain only small letters and commas.',
      );
    }

    // Check if event with the same title already exists except for the current event
    const existingEvent = await this.eventRepository.findOne({
      where: { title: updateEventDto.title, id: Not(eventId) },
    });
    if (existingEvent) {
      throw new ForbiddenException(
        `Event with title "${updateEventDto.title}" already exists.`,
      );
    }

    let event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found.`);
    }

    Object.assign(event, updateEventDto);

    if (file) {
      if (event.thumbnailImage) {
        const oldImagePath = join(
          './public/uploads/event-images',
          event.thumbnailImage,
        );
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          // If the old image doesn't exist, it's not an error. If it does and fails, it is.
          // For simplicity, we're throwing an error here, but in production, you might differentiate.
          if (error.code !== 'ENOENT') {
            // ENOENT means file not found
            throw new InternalServerErrorException(
              `Failed to delete old event image: ${error.message}`,
            );
          }
        }
      }

      const ext = extname(file.originalname);
      const newFileName = `${event.id}${ext}`;
      const oldPath = file.path;
      const newPath = join('./public/uploads/event-images', newFileName);

      try {
        await fs.rename(oldPath, newPath);
      } catch (error) {
        throw new InternalServerErrorException(
          `Failed to save new event image: ${error.message}`,
        );
      }
      event.thumbnailImage = newFileName;
    }

    const updatedEvent = await this.eventRepository.save(event);
    return this.mapEventToResponseDto(updatedEvent);
  }

  async deleteEvent(eventId: number) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found.`);
    }

    if (event.thumbnailImage) {
      const imagePath = join(
        './public/uploads/event-images',
        event.thumbnailImage,
      );
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw new InternalServerErrorException(
            `Failed to delete event image`,
          );
        }
      }
    }

    const result = await this.eventRepository.delete(eventId);
    return !!result.affected && result.affected > 0;
  }

  async findAllEvents() {
    const events = await this.eventRepository.find({
      order: {
        eventStartDate: 'ASC',
        createdAt: 'DESC',
      },
    });

    // For each event, get sum of seatsBooked from Booking table
    const eventIds = events.map((e) => e.id);

    // Fetch sums in a single query
    const bookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('booking.eventId', 'eventId')
      .addSelect('SUM(booking.seatsBooked)', 'bookedCount')
      .where('booking.eventId IN (:...eventIds)', { eventIds })
      .groupBy('booking.eventId')
      .getRawMany();

    // Convert to map for faster lookup
    const bookedCountMap = new Map<number, number>();
    bookings.forEach((b) => bookedCountMap.set(+b.eventId, +b.bookedCount));

    // Map events to response DTOs with bookedCount
    return events.map((event) => {
      const bookedCount = bookedCountMap.get(event.id) || 0;
      return this.mapEventToResponseDtoWithBookedCount(event, bookedCount);
    });
  }

  //-------------------------- Helper Methods --------------------------
  private mapEventToResponseDto(event: Event): EventResponseDto {
    const responseDto = new EventResponseDto();
    responseDto.id = event.id;
    responseDto.title = event.title;
    responseDto.description = event.description;
    responseDto.eventStartDate = event.eventStartDate;
    responseDto.eventEndDate = event.eventEndDate;
    responseDto.totalCapacity = event.totalCapacity;
    responseDto.eventLocation = event.eventLocation;
    responseDto.eventTags = event.eventTags;
    responseDto.thumbnailImage = event.thumbnailImage;
    return responseDto;
  }

  private mapEventToResponseDtoWithBookedCount(
    event: Event,
    bookedCount: number,
  ): EventResponseDto {
    const responseDto = new EventResponseDto();
    responseDto.id = event.id;
    responseDto.title = event.title;
    responseDto.description = event.description;
    responseDto.eventStartDate = event.eventStartDate;
    responseDto.eventEndDate = event.eventEndDate;
    responseDto.totalCapacity = event.totalCapacity;
    responseDto.eventLocation = event.eventLocation;
    responseDto.eventTags = event.eventTags;
    responseDto.thumbnailImage = event.thumbnailImage;
    responseDto.bookedCount = bookedCount;
    return responseDto;
  }
}
