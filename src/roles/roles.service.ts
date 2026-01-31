import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RoleDocument } from './entities/role.entity';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(private readonly rolesRepository: RolesRepository) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    this.logger.log(`Creating role: ${createRoleDto.name}`);

    const exists = await this.rolesRepository.exists(createRoleDto.name);
    if (exists) {
      this.logger.warn(`Role ${createRoleDto.name} already exists`);
      throw new ConflictException(`Role ${createRoleDto.name} already exists`);
    }

    return this.rolesRepository.create(createRoleDto);
  }

  async findAll(): Promise<RoleDocument[]> {
    this.logger.log('Finding all roles');
    return this.rolesRepository.findAll();
  }

  async findById(id: string): Promise<RoleDocument | null> {
    this.logger.log(`Finding role by id: ${id}`);
    return this.rolesRepository.findById(id);
  }

  async findByName(name: string): Promise<RoleDocument | null> {
    this.logger.log(`Finding role by name: ${name}`);
    return this.rolesRepository.findByName(name);
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument | null> {
    this.logger.log(`Updating role: ${id}`);
    return this.rolesRepository.update(id, updateRoleDto);
  }

  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting role: ${id}`);
    return this.rolesRepository.delete(id);
  }

  async addPermission(
    roleId: string,
    permissionId: string,
  ): Promise<RoleDocument | null> {
    this.logger.log(`Adding permission ${permissionId} to role ${roleId}`);
    return this.rolesRepository.addPermission(roleId, permissionId);
  }

  async removePermission(
    roleId: string,
    permissionId: string,
  ): Promise<RoleDocument | null> {
    this.logger.log(`Removing permission ${permissionId} from role ${roleId}`);
    return this.rolesRepository.removePermission(roleId, permissionId);
  }
}
