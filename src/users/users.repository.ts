/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const userData = {
      ...createUserDto,
      role: new Types.ObjectId(createUserDto.roleId),
    };
    const user = new this.userModel(userData);
    return user.save();
  }

  async findAll(query: FindAllUsersDto): Promise<UserDocument[]> {
    const { orderByDate, ...restQuery } = query;
    return this.userModel
      .find({ ...restQuery })
      .sort({ createdAt: orderByDate === 'asc' ? 1 : -1 })
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission',
        },
      })
      .exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findById(id)
      .populate({
        path: 'role',
      })
      .exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email })
      .populate({
        path: 'role',
      })
      .exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.roleId) {
      updateData.role = new Types.ObjectId(updateUserDto.roleId);
      delete updateData.roleId;
    }
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate({
        path: 'role',
        populate: { path: 'permissions' },
      })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async exists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    return user !== null;
  }
}
