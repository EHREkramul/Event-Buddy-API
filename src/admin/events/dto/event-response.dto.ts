import { ApiProperty } from '@nestjs/swagger';

export class EventResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the event.',
    example: 7,
  })
  id: number;

  @ApiProperty({
    description: 'The title of the event.',
    example: 'NestJS Global Summit 2025',
  })
  title: string;

  @ApiProperty({
    description: 'A detailed description of the event.',
    example:
      'Join us for the annual NestJS Global Summit, bringing together developers from around the world to share knowledge and experiences with the NestJS framework.',
  })
  description: string;

  @ApiProperty({
    description: 'The start date and time of the event in ISO 8601 format.',
    example: '2025-10-15T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  eventStartDate: Date;

  @ApiProperty({
    description: 'The end date and time of the event in ISO 8601 format.',
    example: '2025-10-16T17:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  eventEndDate: Date;

  @ApiProperty({
    description: 'The total number of available spots for the event.',
    example: 23,
  })
  totalCapacity: number;

  @ApiProperty({
    description: 'The physical or virtual location of the event.',
    example: 'Virtual Conference Center / New York City, NY',
  })
  eventLocation: string;

  @ApiProperty({
    description: 'Comma-separated tags for the event (optional).',
    example: 'nestjs,backend,workshop',
    nullable: true,
  })
  eventTags?: string;

  @ApiProperty({
    description: 'The filename of the thumbnail image (optional).',
    example: '7.jpg',
    nullable: true,
  })
  thumbnailImage?: string;
}
