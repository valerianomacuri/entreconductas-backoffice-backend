import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ModulePermission } from '@/auth/module.decorator';
import { ModuleAccessGuard } from '@/auth/module-access.guard';

@ApiTags('roles')
@ApiBearerAuth('JWT-auth')
@ModulePermission('roles')
@UseGuards(JwtAuthGuard, ModuleAccessGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 409, description: 'Role already exists' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of all roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role found' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  remove(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }

  @Post(':id/modules/:moduleId')
  @ApiOperation({ summary: 'Add module to role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiParam({ name: 'moduleId', description: 'Module ID' })
  @ApiResponse({ status: 200, description: 'Module added successfully' })
  addModule(@Param('id') id: string, @Param('moduleId') moduleId: string) {
    return this.rolesService.addModule(id, moduleId);
  }

  @Delete(':id/modules/:moduleId')
  @ApiOperation({ summary: 'Remove module from role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiParam({ name: 'moduleId', description: 'Module ID' })
  @ApiResponse({ status: 200, description: 'Module removed successfully' })
  removeModule(@Param('id') id: string, @Param('moduleId') moduleId: string) {
    return this.rolesService.removeModule(id, moduleId);
  }
}
