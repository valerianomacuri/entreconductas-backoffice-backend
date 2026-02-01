/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApplicationStatus } from '../enums/application-status.enum';

export class ResponseDto {
  @ApiProperty({
    description: 'Response key',
    example: 'por-que-quieres-ser-voluntario-x9k3d',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Response label',
    example: '¿Por qué quieres ser voluntario?',
  })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    description: 'Response value',
    example: 'Me apasiona ayudar a la comunidad',
  })
  @Transform(({ value }) =>
    value === null || value === undefined ? value : String(value),
  )
  @IsString()
  value: any;
}

export class CreateApplicationDto {
  @ApiProperty({ description: 'Call ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  callId: string;

  @ApiProperty({ description: 'Applicant name', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Applicant email', example: 'juan@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Application status',
    enum: ApplicationStatus,
    default: ApplicationStatus.REGISTERED,
    required: false,
  })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiProperty({
    description: 'Form responses',
    type: [ResponseDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseDto)
  responses?: ResponseDto[];

  @ApiProperty({ description: 'Whether email was sent', required: false })
  @IsOptional()
  @IsBoolean()
  emailSent?: boolean;
}
