import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PublicEventsService } from './public-events.service';
import { GetEventsDto } from './dto/get-events.dto';
import { EventDetailsDto } from './dto/event-details.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Public API - Events')
@Controller('public-events')
export class PublicEventsController {
  constructor(private readonly publicEventsService: PublicEventsService) {}

  @Public()
  @Get('getUpcomingEvents')
  @ApiOperation({ summary: 'Get a list of upcoming events' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved upcoming events.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getUpcomingEvents(@Query(ValidationPipe) paginationDto: GetEventsDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    return this.publicEventsService.findUpcomingEvents(page, limit);
  }

  @Public()
  @Get('getPreviousEvents')
  @ApiOperation({ summary: 'Get a list of previous events' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved previous events.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getPreviousEvents(@Query() paginationDto: GetEventsDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    return this.publicEventsService.findPreviousEvents(page, limit);
  }

  @Public()
  @Get('getIndividualEvent/:id')
  @ApiOperation({ summary: 'Get full details of an individual event' })
  @ApiParam({
    name: 'id',
    description: 'ID of the event to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved event details.',
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getEventDetails(@Param() params: EventDetailsDto) {
    const event = await this.publicEventsService.findEventById(params.id);
    if (!event) {
      throw new NotFoundException(
        'Event not found. Please check the event ID.',
      );
    }
    return event;
  }
}
