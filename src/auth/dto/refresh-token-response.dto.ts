import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'dGhpc0lzQVRlc3RSZWZyZXNoVG9rZW4uLi4=',
    description: 'JWT refresh token to obtain a new access token',
  })
  refreshToken: string;
}
