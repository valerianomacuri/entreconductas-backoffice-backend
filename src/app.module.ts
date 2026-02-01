import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AreasModule } from './areas/areas.module';
import { CallsModule } from './calls/calls.module';
import { AppModulesModule } from './app-modules/app-modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    AreasModule,
    CallsModule,
    AppModulesModule,
  ],
})
export class AppModule {}
