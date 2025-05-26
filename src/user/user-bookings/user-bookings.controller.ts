import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  HttpStatus,
  ValidationPipe,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UserBookingsService } from './user-bookings.service';
import { BookEventDto } from './dto/book-event.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UsersRole } from 'src/auth/enums/user-role.enum';

@ApiTags('User (Authenticated)-Bookings')
@ApiBearerAuth()
@Controller('user-bookings')
export class UserBookingsController {
  constructor(private readonly userBookingsService: UserBookingsService) {}

  @Roles(UsersRole.USER)
  @Post('bookEvent')
  @ApiOperation({ summary: 'Book seat(s) for an event' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Seats successfully booked.',
  })
  @ApiBearerAuth()
  @ApiForbiddenResponse({
    description: 'Forbidden. Only users can book events.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Invalid booking request (e.g., overbooking, event ended, invalid seats).',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found or User not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'User has already booked seats for this event. Modify booking instead.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async bookEvent(
    @Req() req: any,
    @Body(ValidationPipe) bookEventDto: BookEventDto,
  ) {
    const userId = req.user.id;
    return this.userBookingsService.bookEvent(
      userId,
      bookEventDto.eventId,
      bookEventDto.seatsBooked,
    );
  }

  @Get('getUserBookings')
  @Roles(UsersRole.USER)
  @ApiForbiddenResponse({
    description: 'Forbidden. Only users can view their bookings.',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: "View user's booked events" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved user bookings.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async getUserBookings(@Req() req: any) {
    const userId = req.user.id;
    return this.userBookingsService.findUserBookings(userId);
  }

  @Roles(UsersRole.USER)
  @Delete('cancelBooking/:id')
  @ApiOperation({ summary: 'Cancel your booking by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the booking to cancel',
  })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({
    status: 404,
    description: 'Booking not found or unauthorized',
  })
  async cancelBooking(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.id;
    await this.userBookingsService.cancelBooking(id, userId);
    return { message: `Booking with ID ${id} cancelled successfully.` };
  }
}
