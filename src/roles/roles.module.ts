import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';
import { RolesController } from './roles.controller';
import { Role, RoleSchema } from './entities/role.entity';
import { AppModulesModule } from '@/app-modules/app-modules.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    AppModulesModule,
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
  exports: [RolesService, RolesRepository],
})
export class RolesModule {}
