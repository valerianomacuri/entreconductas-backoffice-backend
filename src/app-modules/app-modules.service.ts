import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateAppModuleDto } from './dto/create-app-module.dto';
import { UpdateAppModuleDto } from './dto/update-app-module.dto';
import { AppModulesRepository } from './app-modules.repository';
import { AppModuleDocument } from './entities/app-module.entity';

@Injectable()
export class AppModulesService {
  private readonly logger = new Logger(AppModulesService.name);

  constructor(private readonly appModulesRepository: AppModulesRepository) {}

  async create(createAppModuleDto: CreateAppModuleDto) {
    this.logger.log(`Creating module with name: ${createAppModuleDto.name}`);

    const exists = await this.appModulesRepository.exists(
      createAppModuleDto.name,
    );
    if (exists) {
      this.logger.warn(
        `Module with name ${createAppModuleDto.name} already exists`,
      );
      throw new ConflictException(
        `Module with name ${createAppModuleDto.name} already exists`,
      );
    }

    return this.appModulesRepository.create(createAppModuleDto);
  }

  async findByName(name: string): Promise<AppModuleDocument | null> {
    this.logger.log(`Finding module by name: ${name}`);
    return this.appModulesRepository.findByName(name);
  }

  findAll() {
    return `This action returns all appModules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appModule`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateAppModuleDto: UpdateAppModuleDto) {
    return `This action updates a #${id} appModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} appModule`;
  }
}
