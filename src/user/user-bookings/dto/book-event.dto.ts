import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class BookEventDto {
  @ApiProperty({
    description: 'The ID of the event to book',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  eventId: number;

  @ApiProperty({
    description: 'Number of seats to book (1-4)',
    example: 2,
    minimum: 1,
    maximum: 4,
  })
  @IsInt()
  @Min(1, { message: 'Minimum 1 seat can be booked.' })
  @Max(4, { message: 'Maximum 4 seats can be booked per booking.' })
  @IsNotEmpty()
  seatsBooked: number;
}
