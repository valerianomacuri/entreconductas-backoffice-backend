/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PermissionsService } from '../src/permissions/permissions.service';
import { RolesService } from '../src/roles/roles.service';
import { UsersService } from '../src/users/users.service';
import { CreatePermissionDto } from '../src/permissions/dto/permission.dto';
import { CreateRoleDto } from '../src/roles/dto/role.dto';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

async function seed() {
  console.log('Starting database seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const permissionsService = app.get(PermissionsService);
  const rolesService = app.get(RolesService);
  const usersService = app.get(UsersService);

  try {
    const permissionsToCreate: CreatePermissionDto[] = [
      { module: 'users', actions: ['read', 'write'] },
      { module: 'applicants', actions: ['read', 'write'] },
      { module: 'calls', actions: ['read', 'write'] },
      { module: 'dashboard', actions: ['read', 'write'] },
    ];

    const createdPermissions: Record<string, string> = {};

    for (const permDto of permissionsToCreate) {
      try {
        const existing = await permissionsService.findByModule(permDto.module);
        if (existing) {
          console.log(`Permission ${permDto.module} already exists.`);
          createdPermissions[permDto.module] = existing.id;
        } else {
          const created = await permissionsService.create(permDto);
          console.log(`Permission ${permDto.module} created successfully.`);
          createdPermissions[permDto.module] = created.id;
        }
      } catch {
        console.log(
          `Permission ${permDto.module} already exists (caught exception).`,
        );
        const existing = await permissionsService.findByModule(permDto.module);
        if (existing) {
          createdPermissions[permDto.module] = existing.id;
        }
      }
    }

    const allPermissionIds = Object.values(createdPermissions);
    const managerPermissionIds = allPermissionIds.filter(
      (id) => id !== createdPermissions['users'],
    );

    const rolesToCreate: {
      name: string;
      description: string;
      permissions: string[];
    }[] = [
      {
        name: 'admin',
        description: 'Administrator with all permissions',
        permissions: allPermissionIds,
      },
      {
        name: 'manager',
        description: 'Manager with all permissions except users management',
        permissions: managerPermissionIds,
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
            permissions: roleDto.permissions,
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
