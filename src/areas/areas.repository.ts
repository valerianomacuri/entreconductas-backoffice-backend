import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area, AreaDocument } from './entities/area.entity';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreasRepository {
  private readonly logger = new Logger(AreasRepository.name);

  constructor(
    @InjectModel(Area.name) private readonly areaModel: Model<AreaDocument>,
  ) {}

  async create(createAreaDto: CreateAreaDto): Promise<AreaDocument> {
    const area = new this.areaModel(createAreaDto);
    return area.save();
  }

  async findAll(): Promise<AreaDocument[]> {
    return this.areaModel
      .find({ deletedAt: { $exists: false } })
      .sort({ name: 1 })
      .exec();
  }

  async findById(id: string): Promise<AreaDocument | null> {
    return this.areaModel
      .findOne({ _id: id, deletedAt: { $exists: false } })
      .exec();
  }

  async findByName(name: string): Promise<AreaDocument | null> {
    return this.areaModel
      .findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        deletedAt: { $exists: false },
      })
      .exec();
  }

  async update(
    id: string,
    updateAreaDto: UpdateAreaDto,
  ): Promise<AreaDocument | null> {
    return this.areaModel
      .findByIdAndUpdate(id, updateAreaDto, { new: true })
      .exec();
  }

  async softDelete(id: string): Promise<AreaDocument | null> {
    return this.areaModel
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), isActive: false },
        { new: true },
      )
      .exec();
  }

  async existsByName(name: string): Promise<boolean> {
    const area = await this.areaModel
      .findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        deletedAt: { $exists: false },
      })
      .exec();
    return area !== null;
  }
}
