import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    return plainToInstance(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      email,
    });
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // ----------------- Helper Methods -----------------
  async updateLastLogin(id: number) {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  async updateHashedRefreshToken(userId: number, hashedRefreshToken) {
    return await this.userRepository.update(
      { id: userId },
      { refreshToken: hashedRefreshToken },
    );
  }

  async getUserRefreshTokenFromDB(id: number) {
    if (!id) {
      throw new BadRequestException(`Id is required`);
    }

    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'refreshToken'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
