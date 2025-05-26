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
@ApiTags('Admin-(Authenticated Admin)')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Apply ValidationPipe at controller level
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Roles(UsersRole.ADMIN)
  @Post('create')
  @ApiOperation({ summary: 'Create a new event' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'The event has been successfully created.',
    type: EventResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: Missing or invalid access token.',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden: You do not have permission to access this resource.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: Invalid input data. Check your DTO.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error: Failed to save event image.',
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
    @Body() dto: CreateEventDto,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<EventResponseDto> {
    return this.eventsService.createEvent(dto, req.user.id, file);
  }

  @Roles(UsersRole.ADMIN)
  @Patch('update/:id')
  @ApiOperation({ summary: 'Edit an existing event by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'The event has been successfully updated.',
    type: EventResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: Missing or invalid access token.',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden: You do not have permission to access this resource.',
  })
  @ApiNotFoundResponse({ description: 'Event not found.' })
  @ApiBadRequestResponse({
    description: 'Bad Request: Invalid input data. Check your DTO.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error: Failed to update event image.',
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
    @Param('id', ParseIntPipe) id: number, // Corrected parameter name
    @Body() dto: UpdateEventDto,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<EventResponseDto> {
    const updatedEvent = await this.eventsService.updateEvent(
      +id,
      dto,
      req.user.id,
      file,
    );
    return updatedEvent;
  }

  @Roles(UsersRole.ADMIN)
  @Delete('delete/:id')
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
    description: 'Unauthorized: Missing or invalid access token.',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden: You do not have permission to access this resource.',
  })
  @ApiNotFoundResponse({ description: 'Event not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error: Failed to delete event image.',
  })
  async deleteEvent(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.eventsService.deleteEvent(+id);
    if (!deleted) {
      throw new NotFoundException(`Event with ID ${id} not found.`);
    } else {
      return {
        message: `Event with ID ${id} has been successfully deleted.`,
      };
    }
  }

  @Roles(UsersRole.ADMIN)
  @Get('getAllEvents')
  @ApiOperation({
    summary: 'Get all events (Admin Dashboard View)',
    description: 'Retrieves a list of all events for administrative purposes.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all events.',
    type: [EventResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: Missing or invalid access token.',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden: You do not have permission to access this resource.',
  })
  async getAllEvents(): Promise<EventResponseDto[]> {
    return this.eventsService.findAllEvents();
  }
}
