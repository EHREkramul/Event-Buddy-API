import { Test, TestingModule } from '@nestjs/testing';
import { PublicEventsController } from './public-events.controller';

describe('PublicEventsController', () => {
  let controller: PublicEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicEventsController],
    }).compile();

    controller = module.get<PublicEventsController>(PublicEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
