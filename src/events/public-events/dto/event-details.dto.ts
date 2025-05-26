import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class EventDetailsDto {
  @ApiProperty({ description: 'The unique identifier of the event' })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
