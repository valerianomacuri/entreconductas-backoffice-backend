/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { RolesService } from '../src/roles/roles.service';
import { UsersService } from '../src/users/users.service';
import { CreateAppModuleDto } from '../src/app-modules/dto/create-app-module.dto';
import { CreateRoleDto } from '../src/roles/dto/role.dto';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { AppModulesService } from '@/app-modules/app-modules.service';

async function seed() {
  console.log('Starting database seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const appModulesService = app.get(AppModulesService);
  const rolesService = app.get(RolesService);
  const usersService = app.get(UsersService);

  try {
    const appModuleToCreate: CreateAppModuleDto[] = [
      { name: 'users' },
      { name: 'applications' },
      { name: 'calls' },
      { name: 'areas' },
      { name: 'dashboard' },
      { name: 'roles' },
      { name: 'app-modules' },
    ];

    const createdAppModules: Record<string, string> = {};

    for (const modDto of appModuleToCreate) {
      try {
        const existing = await appModulesService.findByName(modDto.name);
        if (existing) {
          console.log(`Module ${modDto.name} already exists.`);
          createdAppModules[modDto.name] = existing.id;
        } else {
          const created = await appModulesService.create(modDto);
          console.log(`Module ${modDto.name} created successfully.`);
          createdAppModules[modDto.name] = created.id;
        }
      } catch {
        console.log(`Module ${modDto.name} already exists (caught exception).`);
        const existing = await appModulesService.findByName(modDto.name);
        if (existing) {
          createdAppModules[modDto.name] = existing.id;
        }
      }
    }

    const allAppModuleId = Object.values(createdAppModules);
    const managerAppModuleIds = allAppModuleId.filter(
      (id) =>
        id !== createdAppModules['users'] &&
        id !== createdAppModules['roles'] &&
        id !== createdAppModules['app-modules'],
    );

    const rolesToCreate: {
      name: string;
      description: string;
      modules: string[];
    }[] = [
      {
        name: 'admin',
        description: 'Administrator with all modules',
        modules: allAppModuleId,
      },
      {
        name: 'manager',
        description: 'Manager with all modules except users management',
        modules: managerAppModuleIds,
      },
    ];

    const createdRoles: Record<string, string> = {};

    for (const roleDto of rolesToCreate) {
      try {
        const existing = await rolesService.findByName(roleDto.name);
        if (existing) {
          console.log(`Role ${roleDto.name} already exists.`);
          createdRoles[roleDto.name] = existing.id;
        } else {
          const createRoleDto: CreateRoleDto = {
            name: roleDto.name,
            description: roleDto.description,
            modules: roleDto.modules,
          };
          const created = await rolesService.create(createRoleDto);
          console.log(`Role ${roleDto.name} created successfully.`);
          createdRoles[roleDto.name] = created.id;
        }
      } catch {
        console.log(`Role ${roleDto.name} already exists (caught exception).`);
        const existing = await rolesService.findByName(roleDto.name);
        if (existing) {
          createdRoles[roleDto.name] = existing.id;
        }
      }
    }

    const adminRoleId = createdRoles['admin'];
    const managerRoleId = createdRoles['manager'];

    if (adminRoleId) {
      const existingAdmin = await usersService.findByEmail(
        'admin@entreconductas.org',
      );
      if (existingAdmin) {
        console.log('Admin user already exists. Skipping.');
      } else {
        const adminUserDto: CreateUserDto = {
          name: 'System Administrator',
          email: 'admin@entreconductas.org',
          password: 'admin123',
          roleId: adminRoleId,
          isActive: true,
        };
        await usersService.create(adminUserDto);
        console.log('Admin user created successfully.');
      }
    }

    if (managerRoleId) {
      const existingManager = await usersService.findByEmail(
        'manager@entreconductas.org',
      );
      if (existingManager) {
        console.log('Manager user already exists. Skipping.');
      } else {
        const managerUserDto: CreateUserDto = {
          name: 'Sample Manager',
          email: 'manager@entreconductas.org',
          password: 'manager123',
          roleId: managerRoleId,
          isActive: true,
        };
        await usersService.create(managerUserDto);
        console.log('Manager user created successfully.');
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

seed();
