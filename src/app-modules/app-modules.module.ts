import { Module } from '@nestjs/common';
import { AppModulesService } from './app-modules.service';
import { AppModulesController } from './app-modules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule, AppModuleSchema } from './entities/app-module.entity';
import { AppModulesRepository } from './app-modules.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppModule.name, schema: AppModuleSchema },
    ]),
  ],
  controllers: [AppModulesController],
  providers: [AppModulesService, AppModulesRepository],
  exports: [AppModulesService, AppModulesRepository],
})
export class AppModulesModule {}
