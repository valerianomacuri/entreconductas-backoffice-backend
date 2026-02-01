import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCallDto } from './create-call.dto';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
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

export class UpdateCallDto extends PartialType(CreateCallDto) {
  @ApiProperty({
    description: 'Call status',
    enum: CallStatus,
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
