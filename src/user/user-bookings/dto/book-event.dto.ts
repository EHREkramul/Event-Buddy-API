import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class BookEventDto {
  @ApiProperty({
    description: 'The ID of the event to book',
    example: 1,
  })
  @IsInt({ message: 'Event ID must be an integer.' })
  @IsNotEmpty({ message: 'Event ID is required.' })
  eventId: number;

  @ApiProperty({
    description: 'Number of seats to book (1-4)',
    example: 2,
    minimum: 1,
    maximum: 4,
  })
  @IsInt({ message: 'Number of seats must be an integer.' })
  @Min(1, { message: 'Minimum 1 seat can be booked.' })
  @Max(4, { message: 'Maximum 4 seats can be booked per booking.' })
  @IsNotEmpty({ message: 'Number of seats is required.' })
  seatsBooked: number;
}
