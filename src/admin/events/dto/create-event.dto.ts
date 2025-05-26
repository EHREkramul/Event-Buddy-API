import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  MinLength,
  MaxLength,
  Min,
  IsPositive,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: 'The title of the event. Must be at least 3 characters.',
    example: 'Deans award ceremony',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description:
      'A detailed description of the event. Must be at least 10 characters.',
    example:
      'Join us for the annual Deans award ceremony, celebrating the achievements of our students and faculty.',
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10, {
    message: 'Description must be at least 10 characters long.',
  })
  description: string;

  @ApiProperty({
    description:
      'The start date and time of the event in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ).',
    example: '2025-10-15T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  eventStartDate: Date;

  @ApiProperty({
    description:
      'The end date and time of the event in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ).',
    example: '2025-10-16T17:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  eventEndDate: Date;

  @ApiProperty({
    description:
      'The total number of available spots for the event. Must be a positive integer (e.g., 1 or greater).',
    example: 150,
    minimum: 1,
    type: 'integer',
  })
  @IsNotEmpty()
  totalCapacity: number;

  @ApiProperty({
    description:
      'The Location of the event. Must be between 3 and 255 characters.',
    example: 'Virtual Conference Center / New York City, NY',
    minLength: 5,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: 'Event location must be at least 5 characters long.',
  })
  @MaxLength(255, {
    message: 'Event location cannot be longer than 255 characters.',
  })
  eventLocation: string;

  @ApiProperty({
    description:
      'Must be in small letters and separated by commas. Max 255 characters. (e.g., "tech,nestjs,conference"). ',
    example: 'nestjs,backend,workshop',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'Event tags cannot be longer than 255 characters.',
  })
  eventTags?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description:
      'Optional thumbnail image for the event (max 5MB, accepted formats: jpg, png, webp). This is handled by multipart/form-data.',
  })
  @IsOptional()
  thumbnailImage?: string;
}
