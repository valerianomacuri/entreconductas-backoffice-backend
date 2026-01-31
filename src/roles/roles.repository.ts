/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument } from './entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@Injectable()
export class RolesRepository {
  private readonly logger = new Logger(RolesRepository.name);

  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    const permissionIds = createRoleDto.permissions.map(
      (id) => new Types.ObjectId(id),
    );
    const role = new this.roleModel({
      ...createRoleDto,
      permissions: permissionIds,
    });
    return role.save();
  }

  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel.find().populate('permissions').exec();
  }

  async findById(id: string): Promise<RoleDocument | null> {
    return this.roleModel.findById(id).populate('permissions').exec();
  }

  async findByName(name: string): Promise<RoleDocument | null> {
    return this.roleModel.findOne({ name }).populate('permissions').exec();
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument | null> {
    const updateData: any = { ...updateRoleDto };
    if (updateRoleDto.permissions) {
      updateData.permissions = updateRoleDto.permissions.map(
        (id) => new Types.ObjectId(id),
      );
    }
    return this.roleModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('permissions')
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.roleModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async exists(name: string): Promise<boolean> {
    const role = await this.roleModel.findOne({ name }).exec();
    return role !== null;
  }

  async addPermission(
    roleId: string,
    permissionId: string,
  ): Promise<RoleDocument | null> {
    return this.roleModel
      .findByIdAndUpdate(
        roleId,
        { $addToSet: { permissions: new Types.ObjectId(permissionId) } },
        { new: true },
      )
      .populate('permissions')
      .exec();
  }

  async removePermission(
    roleId: string,
    permissionId: string,
  ): Promise<RoleDocument | null> {
    return this.roleModel
      .findByIdAndUpdate(
        roleId,
        { $pull: { permissions: new Types.ObjectId(permissionId) } },
        { new: true },
      )
      .populate('permissions')
      .exec();
  }
}
