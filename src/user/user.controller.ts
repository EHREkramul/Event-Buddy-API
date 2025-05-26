import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Returns the profile of the currently authenticated user',
  })
  @ApiResponse({
    status: 200,
    type: UserResponseDto,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return this.userService.findOne(req.user.id);
  }
}
