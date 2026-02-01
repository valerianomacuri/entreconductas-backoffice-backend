import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateAreaDto {
  @ApiProperty({ description: 'Area name', example: 'Technology' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Area description',
    required: false,
    example: 'Technology related calls',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Area active status',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
