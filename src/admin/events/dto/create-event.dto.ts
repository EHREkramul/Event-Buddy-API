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
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description:
      'The title of the event. Must be greater than or equal to 3 characters.',
    example: 'NestJS Global Summit 2025',
    minLength: 3,
  })
  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title should not be empty.' })
  @MinLength(3, { message: 'Title must be at least 3 characters long.' })
  title: string;

  @ApiProperty({
    description:
      'A detailed description of the event. Must be between 10 and 1000 characters.',
    example:
      'Join us for the annual NestJS Global Summit, bringing together developers from around the world to share knowledge and experiences with the NestJS framework.',
    minLength: 10,
  })
  @IsString({ message: 'Description must be a string.' })
  @IsNotEmpty({ message: 'Description should not be empty.' })
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
  @IsDateString(
    {},
    { message: 'Event start date must be a valid ISO 8601 date string.' },
  )
  @IsNotEmpty({ message: 'Event start date should not be empty.' })
  eventStartDate: Date;

  @ApiProperty({
    description:
      'The end date and time of the event in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ). Must be after eventStartDate.',
    example: '2025-10-16T17:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString(
    {},
    { message: 'Event end date must be a valid ISO 8601 date string.' },
  )
  @IsNotEmpty({ message: 'Event end date should not be empty.' })
  // You might want to add a custom validator here to ensure eventEndDate is after eventStartDate
  eventEndDate: Date;

  @ApiProperty({
    description:
      'The total number of available spots for the event. Must be a positive integer (e.g., 1 or greater).',
    example: 150,
    minimum: 1,
    type: 'integer',
  })
  @IsInt({ message: 'Total capacity must be an integer.' })
  @Min(1, { message: 'Total capacity must be at least 1.' })
  totalCapacity: number;

  @ApiProperty({
    description:
      'The physical or virtual location of the event. Must be between 5 and 255 characters.',
    example: 'Virtual Conference Center / New York City, NY',
    minLength: 5,
    maxLength: 255,
  })
  @IsString({ message: 'Event location must be a string.' })
  @IsNotEmpty({ message: 'Event location should not be empty.' })
  @MinLength(5, {
    message: 'Event location must be at least 5 characters long.',
  })
  @MaxLength(255, {
    message: 'Event location cannot be longer than 255 characters.',
  })
  eventLocation: string;

  @ApiProperty({
    description:
      'Optional comma-separated tags for the event (e.g., "tech,nestjs,conference"). Max 255 characters.',
    example: 'nestjs,backend,workshop',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Event tags must be a string.' })
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
