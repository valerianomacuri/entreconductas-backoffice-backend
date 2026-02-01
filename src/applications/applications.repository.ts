/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { FindApplicationsDto } from './dto/find-applications.dto';

@Injectable()
export class ApplicationsRepository {
  private readonly logger = new Logger(ApplicationsRepository.name);

  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<ApplicationDocument>,
  ) {}

  create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<ApplicationDocument> {
    const application = new this.applicationModel(createApplicationDto);
    return application.save();
  }

  async findAll(findDto: FindApplicationsDto): Promise<ApplicationDocument[]> {
    const filter: any = { deletedAt: { $exists: false } };

    if (findDto.call) {
      filter.call = new Types.ObjectId(findDto.call);
    }
    if (findDto.status) {
      filter.status = findDto.status;
    }
    if (findDto.email) {
      filter.email = findDto.email;
    }

    return this.applicationModel
      .find(filter)
      .populate({ path: 'call', populate: { path: 'area' } })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<ApplicationDocument | null> {
    return this.applicationModel
      .findOne({ _id: id, deletedAt: { $exists: false } })
      .populate({ path: 'call' })
      .exec();
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<ApplicationDocument | null> {
    return this.applicationModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate({ path: 'call' })
      .exec();
  }

  async softDelete(id: string): Promise<ApplicationDocument | null> {
    return this.applicationModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .populate({ path: 'call' })
      .exec();
  }
}
