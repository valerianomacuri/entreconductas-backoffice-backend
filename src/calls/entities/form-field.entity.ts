import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { FieldType } from '../enums/call.enums';

export type FormFieldDocument = FormField & Document;

@Schema({ _id: false })
export class FormField {
  @ApiProperty({ description: 'Field identifier', example: 'field-001' })
  @Prop({ required: true })
  id: string;

  @ApiProperty({
    description: 'Field type',
    enum: FieldType,
    example: FieldType.SHORT_TEXT,
  })
  @Prop({ required: true, enum: FieldType })
  type: FieldType;

  @ApiProperty({ description: 'Field label', example: 'Full Name' })
  @Prop({ required: true })
  label: string;

  @ApiProperty({ description: 'Whether the field is required', example: true })
  @Prop({ required: true })
  required: boolean;

  @ApiProperty({
    description: 'Options for select type fields',
    required: false,
    example: ['Option 1', 'Option 2'],
  })
  @Prop({ type: [String], default: undefined })
  options?: string[];
}

export const FormFieldSchema = SchemaFactory.createForClass(FormField);
