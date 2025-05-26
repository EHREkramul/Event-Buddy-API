import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException, // Import for file operation errors
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from 'src/entities/event.entity';
import { EventResponseDto } from './dto/event-response.dto';
import { promises as fs } from 'fs';
import { join, extname } from 'path';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Helper method to map an Event entity to EventResponseDto
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

  async createEvent(
    dto: CreateEventDto,
    userId: number,
    file?: Express.Multer.File,
  ): Promise<EventResponseDto> {
    const event = this.eventRepository.create({
      ...dto,
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
        throw new InternalServerErrorException(
          `Failed to save event image: ${error.message}`,
        );
      }

      savedEvent.thumbnailImage = newFileName;
      await this.eventRepository.save(savedEvent);
    }

    return this.mapEventToResponseDto(savedEvent);
  }

  async updateEvent(
    id: number,
    dto: UpdateEventDto,
    userId: number,
    file?: Express.Multer.File,
  ): Promise<EventResponseDto> {
    let event = await this.eventRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found.`);
    }

    Object.assign(event, dto);

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

  async deleteEvent(id: number): Promise<boolean> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!event) {
      return false;
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
            `Failed to delete event image: ${error.message}`,
          );
        }
      }
    }

    const result = await this.eventRepository.delete(id);
    return !!result.affected && result.affected > 0;
  }

  async findAllEvents(): Promise<EventResponseDto[]> {
    const events = await this.eventRepository.find({
      order: {
        eventStartDate: 'ASC',
        createdAt: 'DESC',
      },
    });
    return events.map((event) => this.mapEventToResponseDto(event));
  }
}
