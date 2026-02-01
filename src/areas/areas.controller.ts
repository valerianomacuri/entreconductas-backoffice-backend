import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Area, AreaDocument } from './entities/area.entity';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { AreasService } from './areas.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('areas')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new area',
    description: 'Creates a new area for organizing calls.',
  })
  @ApiResponse({
    status: 201,
    description: 'Area created successfully',
    type: Area,
  })
  @ApiResponse({
    status: 409,
    description: 'Area with this name already exists',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async create(@Body() createAreaDto: CreateAreaDto): Promise<AreaDocument> {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all areas',
    description: 'Returns the complete list of areas.',
  })
  @ApiResponse({ status: 200, description: 'List of all areas', type: [Area] })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async findAll(): Promise<AreaDocument[]> {
    return this.areasService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get area by ID',
    description: 'Provides the details of a single area.',
  })
  @ApiParam({ name: 'id', description: 'Area ID' })
  @ApiResponse({ status: 200, description: 'Area found', type: Area })
  @ApiResponse({ status: 404, description: 'Area not found' })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async findById(@Param('id') id: string): Promise<AreaDocument> {
    return this.areasService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update area by ID',
    description: 'Updates area attributes.',
  })
  @ApiParam({ name: 'id', description: 'Area ID' })
  @ApiResponse({
    status: 200,
    description: 'Area updated successfully',
    type: Area,
  })
  @ApiResponse({ status: 404, description: 'Area not found' })
  @ApiResponse({
    status: 409,
    description: 'Area with this name already exists',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAreaDto: UpdateAreaDto,
  ): Promise<AreaDocument> {
    return this.areasService.update(id, updateAreaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft delete area by ID',
    description: 'Removes an area by setting deletedAt timestamp.',
  })
  @ApiParam({ name: 'id', description: 'Area ID' })
  @ApiResponse({ status: 204, description: 'Area deleted successfully' })
  @ApiResponse({ status: 404, description: 'Area not found' })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.areasService.softDelete(id);
  }
}
