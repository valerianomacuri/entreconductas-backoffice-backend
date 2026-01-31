import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Module name', example: 'users' })
  @IsString()
  @IsNotEmpty()
  module: string;

  @ApiProperty({
    description: 'Actions allowed',
    example: ['read', 'write'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  actions: string[];
}

export class UpdatePermissionDto {
  @ApiPropertyOptional({ description: 'Module name', example: 'users' })
  @IsString()
  @IsOptional()
  module?: string;

  @ApiPropertyOptional({
    description: 'Actions allowed',
    example: ['read', 'write'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  actions?: string[];
}
