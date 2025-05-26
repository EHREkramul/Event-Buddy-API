import { Test, TestingModule } from '@nestjs/testing';
import { UserBookingsService } from './user-bookings.service';

describe('UserBookingsService', () => {
  let service: UserBookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBookingsService],
    }).compile();

    service = module.get<UserBookingsService>(UserBookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
