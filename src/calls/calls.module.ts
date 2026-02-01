import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { CallsRepository } from './calls.repository';
import { Call, CallSchema } from './entities/call.entity';
import { AreasModule } from '../areas/areas.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Call.name, schema: CallSchema }]),
    AreasModule,
  ],
  controllers: [CallsController],
  providers: [CallsService, CallsRepository],
  exports: [CallsService],
})
export class CallsModule {}
