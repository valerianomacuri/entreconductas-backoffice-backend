import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AppModulesService } from './app-modules.service';
import { CreateAppModuleDto } from './dto/create-app-module.dto';
import { UpdateAppModuleDto } from './dto/update-app-module.dto';
import { ModulePermission } from '@/auth/module.decorator';
import { JwtAuthGuard } from '@/auth/jwt.guard';
import { ModuleAccessGuard } from '@/auth/module-access.guard';

@ModulePermission('app-modules')
@UseGuards(JwtAuthGuard, ModuleAccessGuard)
@Controller('app-modules')
export class AppModulesController {
  constructor(private readonly appModulesService: AppModulesService) {}

  @Post()
  create(@Body() createAppModuleDto: CreateAppModuleDto) {
    return this.appModulesService.create(createAppModuleDto);
  }

  @Get()
  findAll() {
    return this.appModulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appModulesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppModuleDto: UpdateAppModuleDto,
  ) {
    return this.appModulesService.update(+id, updateAppModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appModulesService.remove(+id);
  }
}
