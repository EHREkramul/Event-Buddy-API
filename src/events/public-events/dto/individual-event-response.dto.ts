import { ApiProperty } from '@nestjs/swagger';

export class individualEventResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the event' })
  id: number;

  @ApiProperty({
    example: 'Tech Conference 2025',
    description: 'Title of the event',
  })
  title: string;

  @ApiProperty({
    example: 'An annual gathering for tech enthusiasts.',
    description: 'Description of the event',
  })
  description: string;

  @ApiProperty({
    example: '2025-09-15T10:00:00.000Z',
    description: 'Event start date and time in ISO format',
  })
  eventStartDate: Date;

  @ApiProperty({
    example: '2025-09-15T18:00:00.000Z',
    description: 'Event end date and time in ISO format',
  })
  eventEndDate: Date;

  @ApiProperty({
    example: 500,
    description: 'Total seat capacity for the event',
  })
  totalCapacity: number;

  @ApiProperty({
    example: 'New York Convention Center',
    description: 'Location where the event is held',
  })
  eventLocation: string;

  @ApiProperty({
    example: 'Tech,Innovation,AI',
    description: 'Tags associated with the event',
  })
  eventTags: string;

  @ApiProperty({
    example: 'https://example.com/images/event-thumbnail.jpg',
    description: 'URL of the event thumbnail image',
  })
  thumbnailImage: string;

  @ApiProperty({
    example: 150,
    description: 'Number of available seats for the event',
  })
  availableSeats: number;
}
