import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { PermissionsRepository } from './permissions.repository';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { PermissionDocument } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);

  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    this.logger.log(
      `Creating permission for module: ${createPermissionDto.module}`,
    );

    const exists = await this.permissionsRepository.exists(
      createPermissionDto.module,
    );
    if (exists) {
      this.logger.warn(
        `Permission for module ${createPermissionDto.module} already exists`,
      );
      throw new ConflictException(
        `Permission for module ${createPermissionDto.module} already exists`,
      );
    }

    return this.permissionsRepository.create(createPermissionDto);
  }

  async findAll(): Promise<PermissionDocument[]> {
    this.logger.log('Finding all permissions');
    return this.permissionsRepository.findAll();
  }

  async findById(id: string): Promise<PermissionDocument | null> {
    this.logger.log(`Finding permission by id: ${id}`);
    return this.permissionsRepository.findById(id);
  }

  async findByModule(module: string): Promise<PermissionDocument | null> {
    this.logger.log(`Finding permission by module: ${module}`);
    return this.permissionsRepository.findByModule(module);
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionDocument | null> {
    this.logger.log(`Updating permission: ${id}`);
    return this.permissionsRepository.update(id, updatePermissionDto);
  }

  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting permission: ${id}`);
    return this.permissionsRepository.delete(id);
  }

  async findByModules(modules: string[]): Promise<PermissionDocument[]> {
    this.logger.log(`Finding permissions by modules: ${modules.join(', ')}`);
    return this.permissionsRepository.findByModules(modules);
  }
}
