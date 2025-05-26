import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
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

  login(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };

    return this.jwtService.sign(payload);
  }
}
