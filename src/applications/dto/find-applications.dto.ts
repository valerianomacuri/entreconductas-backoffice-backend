import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsEmail, IsString } from 'class-validator';
import { ApplicationStatus } from '../enums/application-status.enum';

export class FindApplicationsDto {
  @ApiProperty({ description: 'Filter by call ID', required: false })
  @IsOptional()
  @IsString()
  call?: string;

  @ApiProperty({
    description: 'Filter by status',
    enum: ApplicationStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiProperty({ description: 'Filter by email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}
