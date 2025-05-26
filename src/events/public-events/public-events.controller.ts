import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PublicEventsService } from './public-events.service';
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
  async getUpcomingEvents() {
    return this.publicEventsService.findUpcomingEvents();
  }

  @Public()
  @Get('getPreviousEvents')
  @ApiOperation({ summary: 'Get a list of previous events' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved previous events.',
  })
  async getPreviousEvents() {
    return this.publicEventsService.findPreviousEvents();
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
  async getEventDetails(@Param('id', ParseIntPipe) id: number) {
    return this.publicEventsService.getEventDetails(id);
  }
}
