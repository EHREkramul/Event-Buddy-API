import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PublicEventsService } from './public-events.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { SearchEventDto } from './dto/search-event.dto';
import { IndividualEventResponseDto } from './dto/individual-event-response.dto';
import { Event } from 'src/entities/event.entity';

@ApiTags('Public API - Events')
@Controller('public-events')
export class PublicEventsController {
  constructor(private readonly publicEventsService: PublicEventsService) {}

  @Public()
  @Get('get-upcoming-events')
  @ApiOperation({ summary: 'Get a list of upcoming events' })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 16,
          title: 'asdffasdfasd fadfasdfassdfsfd f',
          description: 'Tech entrepreneurs meetup in Banani',
          eventStartDate: '2025-04-01T18:00:00.000Z',
          eventEndDate: '2025-06-01T21:00:00.000Z',
          totalCapacity: 3,
          eventLocation: 'Banani, Dhaka',
          eventTags: 'startup,networking',
          thumbnailImage: '16.jpg',
          createdAt: '2025-05-26T16:07:33.061Z',
          updatedAt: '2025-05-26T16:07:33.075Z',
        },
      ],
    },
    description: 'Successfully retrieved upcoming events.',
  })
  async getUpcomingEvents() {
    return this.publicEventsService.findUpcomingEvents();
  }

  @Public()
  @Get('get-previous-events')
  @ApiOperation({ summary: 'Get a list of previous events' })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 16,
          title: 'asdffasdfasd fadfasdfassdfsfd f',
          description: 'Tech entrepreneurs meetup in Banani',
          eventStartDate: '2025-04-01T18:00:00.000Z',
          eventEndDate: '2025-06-01T21:00:00.000Z',
          totalCapacity: 3,
          eventLocation: 'Banani, Dhaka',
          eventTags: 'startup,networking',
          thumbnailImage: '16.jpg',
          createdAt: '2025-05-26T16:07:33.061Z',
          updatedAt: '2025-05-26T16:07:33.075Z',
        },
      ],
    },
    description: 'Successfully retrieved previous events.',
  })
  async getPreviousEvents() {
    return this.publicEventsService.findPreviousEvents();
  }

  @Public()
  @Get('get-individual-event/:id')
  @ApiOperation({ summary: 'Get full details of an individual event' })
  @ApiParam({
    name: 'id',
    description: 'ID of the event to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    type: IndividualEventResponseDto,
    description: 'Successfully retrieved event details.',
  })
  async getEventDetails(@Param('id', ParseIntPipe) id: number) {
    return this.publicEventsService.getEventDetails(id);
  }

  @Public()
  @Get('search-event')
  @ApiOperation({
    summary:
      'Search events by a single term matching title, description, location, or tags',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: '1 event(s) found.',
        data: [
          {
            id: 16,
            title: 'asdffasdfasd fadfasdfassdfsfd f',
            description: 'Tech entrepreneurs meetup in Banani',
            eventStartDate: '2025-04-01T18:00:00.000Z',
            eventEndDate: '2025-06-01T21:00:00.000Z',
            totalCapacity: 3,
            eventLocation: 'Banani, Dhaka',
            eventTags: 'startup,networking',
            thumbnailImage: '16.jpg',
            createdAt: '2025-05-26T16:07:33.061Z',
            updatedAt: '2025-05-26T16:07:33.075Z',
          },
        ],
      },
    },
    description: 'List of events matching the search term',
  })
  async searchEvents(@Query() searchDto: SearchEventDto) {
    const events = await this.publicEventsService.searchEvents(searchDto);

    if (events.length === 0) {
      return {
        message: 'No events found matching your search term.',
        data: [],
      };
    }

    return {
      message: `${events.length} event(s) found.`,
      data: events,
    };
  }
}
