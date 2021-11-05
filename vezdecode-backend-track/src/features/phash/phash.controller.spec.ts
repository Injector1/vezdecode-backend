import { Test, TestingModule } from '@nestjs/testing';
import { PhashController } from './phash.controller';

describe('PhashController', () => {
  let controller: PhashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhashController],
    }).compile();

    controller = module.get<PhashController>(PhashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
