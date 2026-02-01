import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAppModuleDto {
  @ApiProperty({ description: 'Module name', example: 'users' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
