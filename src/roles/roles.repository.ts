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
    const result = await this.roleModel
      .aggregate([
        {
          $lookup: {
            from: 'permissions',
            localField: 'permissions',
            foreignField: '_id',
            as: 'permissions',
          },
        },
      ])
      .exec();

    return result as unknown as RoleDocument[];
  }

  async findById(id: string): Promise<RoleDocument | null> {
    const result = await this.roleModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'permissions',
            localField: 'permissions',
            foreignField: '_id',
            as: 'permissions',
          },
        },
      ])
      .exec();

    return (result[0] as RoleDocument) || null;
  }

  async findByName(name: string): Promise<RoleDocument | null> {
    const result = await this.roleModel
      .aggregate([
        { $match: { name } },
        {
          $lookup: {
            from: 'permissions',
            localField: 'permissions',
            foreignField: '_id',
            as: 'permissions',
          },
        },
      ])
      .exec();

    return (result[0] as RoleDocument) || null;
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

    await this.roleModel.findByIdAndUpdate(id, updateData).exec();

    return this.findById(id);
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
    await this.roleModel
      .findByIdAndUpdate(roleId, {
        $addToSet: { permissions: new Types.ObjectId(permissionId) },
      })
      .exec();

    return this.findById(roleId);
  }

  async removePermission(
    roleId: string,
    permissionId: string,
  ): Promise<RoleDocument | null> {
    await this.roleModel
      .findByIdAndUpdate(roleId, {
        $pull: { permissions: new Types.ObjectId(permissionId) },
      })
      .exec();

    return this.findById(roleId);
  }
}
