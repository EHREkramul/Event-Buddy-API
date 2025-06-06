import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
  Patch,
  Param,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UsePipes, // Import UsePipes
  ValidationPipe,
  ParseIntPipe, // Import ValidationPipe
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse, // Added for validation errors
  ApiInternalServerErrorResponse, // Added for file operation errors
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UsersRole } from 'src/auth/enums/user-role.enum';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('events')
@ApiBearerAuth()
@ApiTags('Admin (Authenticated) - Events Management')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Roles(UsersRole.ADMIN)
  @Post('create-new-event')
  @ApiOperation({ summary: 'Create a new event' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'The event has been successfully created.',
    schema: {
      example: {
        id: 17,
        title: 'asdffasdfasd fadfasdfassdfsfd fssdfasd',
        description: 'Tech entrepreneurs meetup in Banani',
        eventStartDate: '2025-04-01T18:00:00Z',
        eventEndDate: '2025-06-01T21:00:00Z',
        totalCapacity: '3',
        eventLocation: 'Banani, Dhaka',
        eventTags: 'startup,networking',
        thumbnailImage: '17.jpg',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden: You do not have permission to access this resource.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: Invalid input data',
  })
  @UseInterceptors(
    FileInterceptor('thumbnailImage', {
      storage: diskStorage({
        destination: './public/uploads/event-images',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const filename = `temp-${Date.now()}${ext}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createEvent(
    @Body(ValidationPipe) createeventDto: CreateEventDto,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventsService.createEvent(createeventDto, req.user.id, file);
  }

  @Roles(UsersRole.ADMIN)
  @Patch('update-event/:id')
  @ApiOperation({ summary: 'Edit an existing event by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'The event has been successfully updated.',
    schema: {
      example: {
        id: 5,
        title: 'Title of the Event',
        description: 'Tech entrepreneurs meetup in Banani',
        eventStartDate: '2025-04-01T18:00:00Z',
        eventEndDate: '2025-06-01T21:00:00Z',
        totalCapacity: '3',
        eventLocation: 'Banani, Dhaka',
        eventTags: 'startup,networking',
        thumbnailImage: '5.jpg',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden: You do not have permission to access this resource.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @UseInterceptors(
    FileInterceptor('thumbnailImage', {
      storage: diskStorage({
        destination: './public/uploads/event-images',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const filename = `temp-update-${Date.now()}${ext}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updatedEvent = await this.eventsService.updateEvent(
      id,
      updateEventDto,
      file,
    );
    return updatedEvent;
  }

  @Roles(UsersRole.ADMIN)
  @Delete('delete-event/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an event by ID' })
  @ApiOkResponse({
    description: 'The event has been successfully deleted.',
    schema: {
      example: {
        message: 'Event with ID 1 has been successfully deleted.',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden: You do not have permission to access this resource.',
  })
  async deleteEvent(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.eventsService.deleteEvent(id);

    if (!deleted) {
      throw new NotFoundException(`Event with ID ${id} not found.`);
    } else {
      return {
        message: `Event with ID ${id} has been successfully deleted.`,
      };
    }
  }

  @Roles(UsersRole.ADMIN)
  @Get('get-all-events')
  @ApiOperation({
    summary: 'Get all events (Admin Dashboard View)',
    description: 'Retrieves a list of all events for administrative purposes.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all events.',
    type: [EventResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden: You do not have permission to access this resource.',
  })
  async getAllEvents() {
    return this.eventsService.findAllEvents();
  }
}
