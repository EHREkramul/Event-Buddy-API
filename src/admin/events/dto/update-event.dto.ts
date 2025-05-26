import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  IsPositive,
  Min,
  IsDateString,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  // You can override properties from CreateEventDto or add new ones specific to update
  // For example, if you want to make sure title is still validated even if optional
  @ApiProperty({
    description:
      'The title of the event. Must be greater than or equal to 3 characters.',
    example: 'Updated NestJS Global Summit 2025',
    minLength: 3,
    required: false, // Make it optional for update
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  @MinLength(3, { message: 'Title must be at least 3 characters long.' })
  title?: string;

  @ApiProperty({
    description:
      'A detailed description of the event. Must be between 10 and 1000 characters.',
    example:
      'Join us for the updated annual NestJS Global Summit, bringing together developers from around the world to share knowledge and experiences with the NestJS framework.',
    minLength: 10,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  @MinLength(10, {
    message: 'Description must be at least 10 characters long.',
  })
  description?: string;

  @ApiProperty({
    description:
      'The start date and time of the event in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ).',
    example: '2025-11-01T09:00:00.000Z',
    type: String,
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Event start date must be a valid ISO 8601 date string.' },
  )
  eventStartDate?: Date;

  @ApiProperty({
    description:
      'The end date and time of the event in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ). Must be after eventStartDate.',
    example: '2025-11-02T18:00:00.000Z',
    type: String,
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Event end date must be a valid ISO 8601 date string.' },
  )
  eventEndDate?: Date;

  @ApiProperty({
    description:
      'The total number of available spots for the event. Must be a positive integer (e.g., 1 or greater).',
    example: 200,
    minimum: 1,
    type: 'integer',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Total capacity must be an integer.' })
  @IsPositive({ message: 'Total capacity must be a positive number.' })
  @Min(1, { message: 'Total capacity must be at least 1.' })
  totalCapacity?: number;

  @ApiProperty({
    description:
      'The physical or virtual location of the event. Must be between 5 and 255 characters.',
    example: 'Updated Conference Hall A',
    minLength: 5,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Event location must be a string.' })
  @MinLength(5, {
    message: 'Event location must be at least 5 characters long.',
  })
  @MaxLength(255, {
    message: 'Event location cannot be longer than 255 characters.',
  })
  eventLocation?: string;

  @ApiProperty({
    description:
      'Optional comma-separated tags for the event (e.g., "tech,nestjs,conference"). Max 255 characters.',
    example: 'nestjs,api,workshop',
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
      'Optional thumbnail image for the event (max 5MB, accepted formats: jpg, png, webp). This is handled by multipart/form-data. Provide this field to update the image.',
  })
  @IsOptional()
  thumbnailImage?: string; // This field is for Swagger documentation, actual file comes via @UploadedFile
}
