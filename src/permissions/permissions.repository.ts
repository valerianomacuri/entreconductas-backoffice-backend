import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Permission, PermissionDocument } from './entities/permission.entity';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionsRepository {
  private readonly logger = new Logger(PermissionsRepository.name);

  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    const permission = new this.permissionModel(createPermissionDto);
    return permission.save();
  }

  async findAll(): Promise<PermissionDocument[]> {
    return this.permissionModel.find().exec();
  }

  async findById(id: string): Promise<PermissionDocument | null> {
    return this.permissionModel.findById(id).exec();
  }

  async findByModule(module: string): Promise<PermissionDocument | null> {
    return this.permissionModel.findOne({ module }).exec();
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionDocument | null> {
    return this.permissionModel
      .findByIdAndUpdate(id, updatePermissionDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.permissionModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async exists(module: string): Promise<boolean> {
    const permission = await this.permissionModel.findOne({ module }).exec();
    return permission !== null;
  }

  async findByModules(modules: string[]): Promise<PermissionDocument[]> {
    return this.permissionModel.find({ module: { $in: modules } }).exec();
  }

  async findByIds(ids: Types.ObjectId[]): Promise<PermissionDocument[]> {
    return this.permissionModel.find({ _id: { $in: ids } }).exec();
  }
}
