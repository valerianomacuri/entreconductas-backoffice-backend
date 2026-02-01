import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppModule, AppModuleDocument } from './entities/app-module.entity';
import { CreateAppModuleDto } from './dto/create-app-module.dto';
import { UpdateAppModuleDto } from './dto/update-app-module.dto';

@Injectable()
export class AppModulesRepository {
  private readonly logger = new Logger(AppModulesRepository.name);

  constructor(
    @InjectModel(AppModule.name)
    private readonly appModuleModel: Model<AppModuleDocument>,
  ) {}

  async create(
    createAppModuleDto: CreateAppModuleDto,
  ): Promise<AppModuleDocument> {
    const module = new this.appModuleModel(createAppModuleDto);
    return module.save();
  }

  async findAll(): Promise<AppModuleDocument[]> {
    return this.appModuleModel.find().exec();
  }

  async findById(id: string): Promise<AppModuleDocument | null> {
    return this.appModuleModel.findById(id).exec();
  }

  async findByName(name: string): Promise<AppModuleDocument | null> {
    return this.appModuleModel.findOne({ name }).exec();
  }

  async update(
    id: string,
    updateAppModuleDto: UpdateAppModuleDto,
  ): Promise<AppModuleDocument | null> {
    return this.appModuleModel
      .findByIdAndUpdate(id, updateAppModuleDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.appModuleModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async exists(name: string): Promise<boolean> {
    const module = await this.appModuleModel.findOne({ name }).exec();
    return module !== null;
  }

  async findByNames(name: string[]): Promise<AppModuleDocument[]> {
    return this.appModuleModel.find({ name: { $in: name } }).exec();
  }

  async findByIds(ids: Types.ObjectId[]): Promise<AppModuleDocument[]> {
    return this.appModuleModel.find({ _id: { $in: ids } }).exec();
  }
}
