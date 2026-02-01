/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Call, CallDocument } from './entities/call.entity';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@Injectable()
export class CallsRepository {
  private readonly logger = new Logger(CallsRepository.name);

  constructor(
    @InjectModel(Call.name) private readonly callModel: Model<CallDocument>,
  ) {}

  async create(createCallDto: CreateCallDto): Promise<CallDocument> {
    const callData = {
      ...createCallDto,
      area: new Types.ObjectId(createCallDto.areaId),
    };
    delete (callData as any).areaId;
    const call = new this.callModel(callData);
    return call.save();
  }

  async findAll(): Promise<CallDocument[]> {
    return this.callModel
      .find({ deletedAt: { $exists: false } })
      .populate({
        path: 'area',
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<CallDocument | null> {
    return this.callModel
      .findOne({ _id: id, deletedAt: { $exists: false } })
      .populate({
        path: 'area',
      })
      .exec();
  }

  async update(
    id: string,
    updateCallDto: UpdateCallDto,
  ): Promise<CallDocument | null> {
    const updateData: any = { ...updateCallDto };
    if (updateCallDto.areaId) {
      updateData.area = new Types.ObjectId(updateCallDto.areaId);
      delete updateData.areaId;
    }
    return this.callModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate({
        path: 'area',
      })
      .exec();
  }

  async softDelete(id: string): Promise<CallDocument | null> {
    return this.callModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .populate({
        path: 'area',
      })
      .exec();
  }
}
