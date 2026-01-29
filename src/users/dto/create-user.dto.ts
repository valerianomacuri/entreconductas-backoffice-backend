import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: ['admin', 'manager'],
    example: 'manager',
  })
  @IsEnum(['admin', 'manager'])
  role: 'admin' | 'manager';

  @ApiProperty({
    description: 'User active status',
    default: true,
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
}
