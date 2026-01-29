import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

async function seed() {
  console.log('Starting database seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Check if admin user already exists
    const existingAdmin = await usersService['usersRepository'].findByEmail(
      'admin@entreconductas.com',
    );

    if (existingAdmin) {
      console.log('Admin user already exists. Skipping seeding.');
    } else {
      // Create admin user
      const adminUserDto: CreateUserDto = {
        name: 'System Administrator',
        email: 'admin@entreconductas.com',
        password: 'admin123',
        role: 'admin',
        isActive: true,
      };

      const adminUser = await usersService.create(adminUserDto);
      console.log('Admin user created successfully:', adminUser.email);
    }

    // Create a sample manager user
    const existingManager = await usersService['usersRepository'].findByEmail(
      'manager@entreconductas.com',
    );

    if (existingManager) {
      console.log('Manager user already exists. Skipping seeding.');
    } else {
      const managerUserDto: CreateUserDto = {
        name: 'Sample Manager',
        email: 'manager@entreconductas.com',
        password: 'manager123',
        role: 'manager',
        isActive: true,
      };

      const managerUser = await usersService.create(managerUserDto);
      console.log('Manager user created successfully:', managerUser.email);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
seed();
