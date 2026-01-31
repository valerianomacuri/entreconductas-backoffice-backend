/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { hashPassword } from '../shared/utils/password.utils';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { RolesService } from '@/roles/roles.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);

    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      this.logger.warn(`User with email ${createUserDto.email} already exists`);
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await hashPassword(createUserDto.password);
    const userToCreate = { ...createUserDto, password: hashedPassword };

    const user = await this.usersRepository.create(userToCreate);
    this.logger.log(`User created successfully with ID: ${user.id}`);

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    this.logger.log(`Fetching user with email: ${email}`);
    return this.usersRepository.findByEmail(email);
  }

  async findAll(query: FindAllUsersDto): Promise<UserDocument[]> {
    let roleDoc;

    if (query.role) {
      this.logger.log(`Looking up role: ${query.role}`);
      roleDoc = await this.rolesService.findByName(query.role);
    }

    if (!roleDoc) {
      this.logger.log(`No users found for role: ${query.role}`);
      return [];
    }

    if (roleDoc) {
      this.logger.log(`Filtering users by role: ${query.role}`);
      query = { ...query, role: roleDoc._id };
    }

    this.logger.log('Fetching all users');
    const users = await this.usersRepository.findAll(query);
    this.logger.log(`Found ${users.length} users`);
    return users;
  }

  async findById(id: string): Promise<UserDocument> {
    this.logger.log(`Fetching user with ID: ${id}`);
    const user = await this.usersRepository.findById(id);

    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    this.logger.log(`Updating user with ID: ${id}`);

    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.usersRepository.exists(
        updateUserDto.email,
      );
      if (emailExists) {
        this.logger.warn(`Email ${updateUserDto.email} already exists`);
        throw new ConflictException('Email already exists');
      }
    }

    const updateData = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await hashPassword(updateUserDto.password);
    }

    const updatedUser = await this.usersRepository.update(id, updateData);
    this.logger.log(`User updated successfully with ID: ${id}`);

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting user with ID: ${id}`);

    const user = await this.usersRepository.findById(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }

    const deleted = await this.usersRepository.delete(id);
    if (!deleted) {
      this.logger.error(`Failed to delete user with ID: ${id}`);
      throw new Error('Failed to delete user');
    }

    this.logger.log(`User deleted successfully with ID: ${id}`);
  }
}
