/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ApplicationsRepository } from './applications.repository';
import { CreateApplicationDto } from './dto/create-application.dto';
import { FindApplicationsDto } from './dto/find-applications.dto';
import { ApplicationDocument } from './schemas/application.schema';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    private readonly applicationsRepository: ApplicationsRepository,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<ApplicationDocument> {
    this.logger.log(
      `Creating application for email: ${createApplicationDto.email}`,
    );

    const applicationData = {
      ...createApplicationDto,
      call: createApplicationDto.callId,
    };
    delete (applicationData as any).callId;

    const application =
      await this.applicationsRepository.create(applicationData);
    this.logger.log(
      `Application created successfully with ID: ${application.id}`,
    );

    return application;
  }

  async findAll(findDto: FindApplicationsDto): Promise<ApplicationDocument[]> {
    this.logger.log(
      `Fetching applications with filters: ${JSON.stringify(findDto)}`,
    );
    return this.applicationsRepository.findAll(findDto);
  }

  async findById(id: string): Promise<ApplicationDocument> {
    this.logger.log(`Fetching application with ID: ${id}`);
    const application = await this.applicationsRepository.findById(id);

    if (!application) {
      this.logger.warn(`Application with ID ${id} not found`);
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async updateStatus(id: string, status: string): Promise<ApplicationDocument> {
    this.logger.log(`Updating application with ID: ${id}`);

    const application = await this.applicationsRepository.findById(id);
    if (!application) {
      this.logger.warn(`Application with ID ${id} not found`);
      throw new NotFoundException('Application not found');
    }

    const updated = await this.applicationsRepository.updateStatus(id, status);
    this.logger.log(`Application updated successfully with ID: ${id}`);
    return updated!;
  }

  async softDelete(id: string): Promise<void> {
    this.logger.log(`Soft deleting application with ID: ${id}`);

    const application = await this.applicationsRepository.findById(id);
    if (!application) {
      this.logger.warn(`Application with ID ${id} not found`);
      throw new NotFoundException('Application not found');
    }

    await this.applicationsRepository.softDelete(id);
    this.logger.log(`Application soft deleted successfully with ID: ${id}`);
  }
}
