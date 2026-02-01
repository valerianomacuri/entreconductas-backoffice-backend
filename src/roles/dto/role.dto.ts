import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: 'Role name', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Administrator with all modules',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Module IDs',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  modules: string[];
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ description: 'Role name', example: 'admin' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Role description',
    example: 'Administrator with all modules',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Module IDs',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  modules?: string[];
}
