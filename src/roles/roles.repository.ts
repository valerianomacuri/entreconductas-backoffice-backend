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
    const moduleIds = createRoleDto.modules.map((id) => new Types.ObjectId(id));
    const role = new this.roleModel({
      ...createRoleDto,
      modules: moduleIds,
    });
    return role.save();
  }

  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel
      .find()
      .populate({
        path: 'modules',
        model: 'AppModule',
      })
      .exec();
  }

  async findById(id: string): Promise<RoleDocument | null> {
    return this.roleModel.findById(id).populate('modules').exec();
  }

  async findByName(name: string): Promise<RoleDocument | null> {
    return this.roleModel.findOne({ name }).populate('modules').exec();
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument | null> {
    const updateData: any = { ...updateRoleDto };
    if (updateRoleDto.modules) {
      updateData.modules = updateRoleDto.modules.map(
        (id) => new Types.ObjectId(id),
      );
    }
    return this.roleModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('modules')
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

  async addModule(
    roleId: string,
    moduleId: string,
  ): Promise<RoleDocument | null> {
    return this.roleModel
      .findByIdAndUpdate(
        roleId,
        { $addToSet: { modules: new Types.ObjectId(moduleId) } },
        { new: true },
      )
      .populate('modules')
      .exec();
  }

  async removeModule(
    roleId: string,
    moduleId: string,
  ): Promise<RoleDocument | null> {
    return this.roleModel
      .findByIdAndUpdate(
        roleId,
        { $pull: { modules: new Types.ObjectId(moduleId) } },
        { new: true },
      )
      .populate('modules')
      .exec();
  }
}
