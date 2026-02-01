import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { AreasRepository } from './areas.repository';
import { Area, AreaSchema } from './entities/area.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]),
  ],
  controllers: [AreasController],
  providers: [AreasService, AreasRepository],
  exports: [AreasService, AreasRepository],
})
export class AreasModule {}
