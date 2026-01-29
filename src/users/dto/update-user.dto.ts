import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'User email',
    example: 'john@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'User password',
    example: 'newpassword123',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'User role',
    enum: ['admin', 'manager'],
    example: 'admin',
    required: false,
  })
  @IsEnum(['admin', 'manager'])
  @IsOptional()
  role?: 'admin' | 'manager';

  @ApiProperty({
    description: 'User active status',
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
}
