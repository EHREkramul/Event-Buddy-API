import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/auth/enums/user-role.enum';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'Unique user ID' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @Expose()
  fullName: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  @Expose()
  email: string;

  @ApiProperty({
    example: UserRole.USER,
    enum: UserRole,
    description: 'Role of the user',
  })
  @Expose()
  role: UserRole;

  @ApiProperty({
    example: '2025-05-26T09:03:10.134Z',
    description: 'Date and time when the user registered',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2025-05-26T09:03:10.134Z',
    description: 'Last login date and time',
    nullable: true,
  })
  @Expose()
  lastLoginAt?: Date;
}
