import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/auth/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description:
      'Full name of the user (3–255 characters, letters and spaces only)',
  })
  @IsString()
  @Length(3, 255, {
    message: 'Full name must be between 3 and 255 characters long',
  })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Full name can only contain letters and spaces',
  })
  fullName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Valid and unique email address',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description:
      'Password must be at least 8 characters long, with at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    example: 'USER',
    enum: UserRole,
    default: UserRole.USER,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
