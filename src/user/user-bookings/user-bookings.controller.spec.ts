import { Test, TestingModule } from '@nestjs/testing';
import { UserBookingsController } from './user-bookings.controller';

describe('UserBookingsController', () => {
  let controller: UserBookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBookingsController],
    }).compile();

    controller = module.get<UserBookingsController>(UserBookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
