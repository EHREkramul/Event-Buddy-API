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

export class UpdateEventDto extends PartialType(CreateEventDto) {}
