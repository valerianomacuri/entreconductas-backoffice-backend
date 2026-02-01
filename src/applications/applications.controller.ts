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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { FindApplicationsDto } from './dto/find-applications.dto';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ModulePermission } from '@/auth/module.decorator';
import { ModuleAccessGuard } from '@/auth/module-access.guard';
import { UpdateStatusApplicationDto } from './dto/update-status-application.dto';
import { Public } from '@/auth/public.decorator';

@ApiTags('applications')
@ApiBearerAuth('JWT-auth')
@ModulePermission('applications')
@UseGuards(JwtAuthGuard, ModuleAccessGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Create a new application',
    description: 'Creates a new application for a call.',
  })
  @ApiResponse({
    status: 201,
    description: 'Application created successfully',
    type: Application,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<ApplicationDocument> {
    return this.applicationsService.create(createApplicationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all applications',
    description: 'Returns the list of applications with optional filters.',
  })
  @ApiQuery({ name: 'call', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['registered', 'under_review', 'approved', 'rejected'],
  })
  @ApiQuery({ name: 'email', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of all applications',
    type: [Application],
  })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async findAll(
    @Query() findDto: FindApplicationsDto,
  ): Promise<ApplicationDocument[]> {
    return this.applicationsService.findAll(findDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get application by ID',
    description: 'Provides the details of a single application.',
  })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({
    status: 200,
    description: 'Application found',
    type: Application,
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async findById(@Param('id') id: string): Promise<ApplicationDocument> {
    return this.applicationsService.findById(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update application by ID',
    description:
      'Updates application attributes including status, responses, and emailSent.',
  })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({
    status: 200,
    description: 'Application updated successfully',
    type: Application,
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusApplicationDto: UpdateStatusApplicationDto,
  ): Promise<ApplicationDocument> {
    return this.applicationsService.updateStatus(
      id,
      updateStatusApplicationDto.status,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft delete application by ID',
    description: 'Removes an application by setting deletedAt timestamp.',
  })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ status: 204, description: 'Application deleted successfully' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.applicationsService.softDelete(id);
  }
}
