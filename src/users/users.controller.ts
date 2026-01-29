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
  ApiQuery,
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RoleGuard } from '../auth/role.guard';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user (admin only)',
    description: 'Accessible only to authenticated users with the admin role.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden. Only admin users can invoke this operation.',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users (admin only)',
    description: 'Returns the complete list of users. Requires the admin role.',
  })
  @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden. Only admin users can invoke this operation.',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID (admin only)',
    description:
      'Provides the details of a single user. Requires the admin role.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden. Only admin users can invoke this operation.',
  })
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user by ID (admin only)',
    description: 'Updates user attributes. Requires the admin role.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden. Only admin users can invoke this operation.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete user by ID (admin only)',
    description: 'Removes a user from the system. Requires the admin role.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden. Only admin users can invoke this operation.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
