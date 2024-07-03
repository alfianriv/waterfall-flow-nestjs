import { Test, TestingModule } from '@nestjs/testing';
import { WaterfallService } from './waterfall.service';

describe('WaterfallService', () => {
  let service: WaterfallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaterfallService],
    }).compile();

    service = module.get<WaterfallService>(WaterfallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
