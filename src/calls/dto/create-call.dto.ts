import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CallStatus } from '../enums/call.enums';
import { FieldType } from '../enums/call.enums';

export class FormFieldDto {
  @ApiProperty({ description: 'Field identifier', example: 'field-001' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Field type',
    enum: FieldType,
    example: FieldType.SHORT_TEXT,
  })
  @IsEnum(FieldType)
  type: FieldType;

  @ApiProperty({ description: 'Field label', example: 'Full Name' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Whether the field is required', example: true })
  @IsBoolean()
  required: boolean;

  @ApiProperty({
    description: 'Options for select type fields',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  options?: string[];
}

export class CreateCallDto {
  @ApiProperty({ description: 'Call name', example: 'Summer 2024 Call' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Area ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  areaId: string;

  @ApiProperty({ description: 'Call start date', example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Call end date', example: '2024-12-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Call status',
    enum: CallStatus,
    default: CallStatus.DRAFT,
    required: false,
  })
  @IsOptional()
  @IsEnum(CallStatus)
  status?: CallStatus;

  @ApiProperty({
    description: 'Form fields configuration',
    type: [FormFieldDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  form?: FormFieldDto[];
}
