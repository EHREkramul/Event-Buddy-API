import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchEventDto {
  @ApiProperty({
    example: 'Tech',
    description:
      'Search term to match in event title, description, location, or tags',
  })
  @IsString()
  search: string;
}
