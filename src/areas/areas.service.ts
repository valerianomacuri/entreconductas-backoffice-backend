import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { AreasRepository } from './areas.repository';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { AreaDocument } from './entities/area.entity';

@Injectable()
export class AreasService {
  private readonly logger = new Logger(AreasService.name);

  constructor(private readonly areasRepository: AreasRepository) {}

  async create(createAreaDto: CreateAreaDto): Promise<AreaDocument> {
    this.logger.log(`Creating area with name: ${createAreaDto.name}`);

    const existingArea = await this.areasRepository.findByName(
      createAreaDto.name,
    );
    if (existingArea) {
      this.logger.warn(`Area with name ${createAreaDto.name} already exists`);
      throw new ConflictException('Area with this name already exists');
    }

    const area = await this.areasRepository.create(createAreaDto);
    this.logger.log(`Area created successfully with ID: ${area.id}`);

    return area;
  }

  async findAll(): Promise<AreaDocument[]> {
    this.logger.log('Fetching all areas');
    const areas = await this.areasRepository.findAll();
    this.logger.log(`Found ${areas.length} areas`);
    return areas;
  }

  async findById(id: string): Promise<AreaDocument> {
    this.logger.log(`Fetching area with ID: ${id}`);
    const area = await this.areasRepository.findById(id);

    if (!area) {
      this.logger.warn(`Area with ID ${id} not found`);
      throw new NotFoundException('Area not found');
    }

    return area;
  }

  async update(
    id: string,
    updateAreaDto: UpdateAreaDto,
  ): Promise<AreaDocument> {
    this.logger.log(`Updating area with ID: ${id}`);

    if (updateAreaDto.name) {
      const existingArea = await this.areasRepository.findByName(
        updateAreaDto.name,
      );
      if (existingArea && existingArea.id !== id) {
        this.logger.warn(`Area with name ${updateAreaDto.name} already exists`);
        throw new ConflictException('Area with this name already exists');
      }
    }

    const area = await this.areasRepository.update(id, updateAreaDto);
    if (!area) {
      this.logger.warn(`Area with ID ${id} not found`);
      throw new NotFoundException('Area not found');
    }

    this.logger.log(`Area updated successfully with ID: ${id}`);
    return area;
  }

  async softDelete(id: string): Promise<void> {
    this.logger.log(`Soft deleting area with ID: ${id}`);

    const area = await this.areasRepository.findById(id);
    if (!area) {
      this.logger.warn(`Area with ID ${id} not found`);
      throw new NotFoundException('Area not found');
    }

    await this.areasRepository.softDelete(id);
    this.logger.log(`Area soft deleted successfully with ID: ${id}`);
  }
}
