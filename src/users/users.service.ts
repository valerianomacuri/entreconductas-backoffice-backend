import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { hashPassword } from '../shared/utils/password.utils';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
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

  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users');
    const users = await this.usersRepository.findAll();
    this.logger.log(`Found ${users.length} users`);
    return users;
  }

  async findById(id: string): Promise<User> {
    this.logger.log(`Fetching user with ID: ${id}`);
    const user = await this.usersRepository.findById(id);

    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
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
