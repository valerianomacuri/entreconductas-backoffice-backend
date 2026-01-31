import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Role ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({
    description: 'User active status',
    default: true,
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
}
