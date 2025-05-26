import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { LoginResponseDto } from './dto/login-response.dto';
import * as argon2 from 'argon2';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { CurrentUser } from './types/current-user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, password: string) {
    if (!email || !password) {
      return false;
    }

    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return {
      id: user.id,
    };
  }

  async login(userId: number): Promise<LoginResponseDto> {
    const { accessToken, refreshToken } = await this.generateTokens(userId);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken); // Store hashed refresh token in the database

    this.userService.updateLastLogin(userId); // Update last login date

    const loginResponseDto: LoginResponseDto = {
      id: userId,
      accessToken,
      refreshToken,
    };

    return loginResponseDto;
  }

  async logout(userId: number) {
    await this.userService.updateHashedRefreshToken(userId, null); // Clear the hashed refresh token in the database
  }

  async refreshToken(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken); // Store hashed refresh token in the database

    const refreshTokenResponseDto: RefreshTokenResponseDto = {
      id: userId,
      accessToken,
      refreshToken,
    };

    return refreshTokenResponseDto;
  }

  //------------------- Helper methods -------------------
  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.getUserRefreshTokenFromDB(userId);

    if (!user || !user.refreshToken)
      throw new UnauthorizedException(`Invalid refresh token`);

    const isRefreshTokenMatching = await argon2.verify(
      user.refreshToken, // Hashed refresh token from the database
      refreshToken,
    );

    if (!isRefreshTokenMatching)
      throw new UnauthorizedException('Invalid Refresh Token');

    return { id: user.id };
  }

  async validateJwtUser(userId: number) {
    const userResponseDto = await this.userService.findOne(userId);

    if (!userResponseDto) throw new UnauthorizedException(`User not found`);

    const currentUser: CurrentUser = {
      id: userResponseDto.id,
      role: userResponseDto.role,
    };
    return currentUser;
  }
}
