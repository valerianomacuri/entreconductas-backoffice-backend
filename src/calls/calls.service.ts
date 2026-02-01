import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CallsRepository } from './calls.repository';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { CallDocument } from './entities/call.entity';

@Injectable()
export class CallsService {
  private readonly logger = new Logger(CallsService.name);

  constructor(private readonly callsRepository: CallsRepository) {}

  async create(createCallDto: CreateCallDto): Promise<CallDocument> {
    this.logger.log(`Creating call with name: ${createCallDto.name}`);

    const call = await this.callsRepository.create(createCallDto);
    this.logger.log(`Call created successfully with ID: ${call.id}`);

    return call;
  }

  async findAll(): Promise<CallDocument[]> {
    this.logger.log('Fetching all calls');
    const calls = await this.callsRepository.findAll();
    this.logger.log(`Found ${calls.length} calls`);
    return calls;
  }

  async findById(id: string): Promise<CallDocument> {
    this.logger.log(`Fetching call with ID: ${id}`);
    const call = await this.callsRepository.findById(id);

    if (!call) {
      this.logger.warn(`Call with ID ${id} not found`);
      throw new NotFoundException('Call not found');
    }

    return call;
  }

  async update(
    id: string,
    updateCallDto: UpdateCallDto,
  ): Promise<CallDocument> {
    this.logger.log(`Updating call with ID: ${id}`);

    const call = await this.callsRepository.update(id, updateCallDto);
    if (!call) {
      this.logger.warn(`Call with ID ${id} not found`);
      throw new NotFoundException('Call not found');
    }

    this.logger.log(`Call updated successfully with ID: ${id}`);
    return call;
  }

  async softDelete(id: string): Promise<void> {
    this.logger.log(`Soft deleting call with ID: ${id}`);

    const call = await this.callsRepository.findById(id);
    if (!call) {
      this.logger.warn(`Call with ID ${id} not found`);
      throw new NotFoundException('Call not found');
    }

    await this.callsRepository.softDelete(id);
    this.logger.log(`Call soft deleted successfully with ID: ${id}`);
  }
}
