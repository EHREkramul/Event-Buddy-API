import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
  })
  async registerUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'User login',
    description:
      'Logs in a user and returns a JWT access and refresh token along with id.',
  })
  @ApiBody({
    type: LoginRequestDto,
    examples: {
      validCredentials: {
        summary: 'Valid login',
        value: {
          email: 'user@example.com',
          password: 'StrongPass123!"',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
  })
  async login(@Request() req: any) {
    const loginResponseDto = this.authService.login(req.user.id);

    return loginResponseDto;
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Refreshes the access token using a valid refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Access token successfully refreshed.',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing refresh token.',
  })
  @ApiBearerAuth()
  async refreshToken(@Request() req: any) {
    return this.authService.refreshToken(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout user',
    description: 'Logs the user out and invalidates the current refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out.',
    schema: {
      example: {
        message: 'User successfully logged out.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - login required.',
  })
  @ApiBearerAuth()
  async logout(@Request() req: any) {
    await this.authService.logout(req.user.id);
    return { message: 'User successfully logged out.' };
  }
}
