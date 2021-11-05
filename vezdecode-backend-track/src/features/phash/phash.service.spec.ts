import { Test, TestingModule } from '@nestjs/testing';
import { PhashService } from './phash.service';

describe('PhashService', () => {
  let service: PhashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhashService],
    }).compile();

    service = module.get<PhashService>(PhashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
