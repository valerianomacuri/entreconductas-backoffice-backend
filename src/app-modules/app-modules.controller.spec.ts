import { Test, TestingModule } from '@nestjs/testing';
import { AppModulesController } from './app-modules.controller';
import { AppModulesService } from './app-modules.service';

describe('AppModulesController', () => {
  let controller: AppModulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppModulesController],
      providers: [AppModulesService],
    }).compile();

    controller = module.get<AppModulesController>(AppModulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
