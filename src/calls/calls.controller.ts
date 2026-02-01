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
import { Call, CallDocument } from './entities/call.entity';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { CallsService } from './calls.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('calls')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new call',
    description: 'Creates a new call for applications.',
  })
  @ApiResponse({
    status: 201,
    description: 'Call created successfully',
    type: Call,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async create(@Body() createCallDto: CreateCallDto): Promise<CallDocument> {
    return this.callsService.create(createCallDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all calls',
    description: 'Returns the complete list of calls.',
  })
  @ApiResponse({ status: 200, description: 'List of all calls', type: [Call] })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async findAll(): Promise<CallDocument[]> {
    return this.callsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get call by ID',
    description: 'Provides the details of a single call.',
  })
  @ApiParam({ name: 'id', description: 'Call ID' })
  @ApiResponse({ status: 200, description: 'Call found', type: Call })
  @ApiResponse({ status: 404, description: 'Call not found' })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async findById(@Param('id') id: string): Promise<CallDocument> {
    return this.callsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update call by ID',
    description: 'Updates call attributes including form and status.',
  })
  @ApiParam({ name: 'id', description: 'Call ID' })
  @ApiResponse({
    status: 200,
    description: 'Call updated successfully',
    type: Call,
  })
  @ApiResponse({ status: 404, description: 'Call not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCallDto: UpdateCallDto,
  ): Promise<CallDocument> {
    return this.callsService.update(id, updateCallDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft delete call by ID',
    description: 'Removes a call by setting deletedAt timestamp.',
  })
  @ApiParam({ name: 'id', description: 'Call ID' })
  @ApiResponse({ status: 204, description: 'Call deleted successfully' })
  @ApiResponse({ status: 404, description: 'Call not found' })
  @ApiForbiddenResponse({
    status: 403,
    description:
      'Forbidden. Only admin or manager users can access this endpoint.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.callsService.softDelete(id);
  }
}
