/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Area } from '../../areas/entities/area.entity';
import { CallStatus } from '../enums/call.enums';
import { FormField, FormFieldSchema } from './form-field.entity';

export type CallDocument = HydratedDocument<Call> & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Call {
  @ApiProperty({ description: 'Call name', example: 'Summer 2024 Call' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Area associated with the call',
    type: () => Area,
  })
  @Prop({ type: Types.ObjectId, ref: Area.name, required: true })
  area: Types.ObjectId;

  @ApiProperty({ description: 'Call start date', example: '2024-01-01' })
  @Prop({ required: true })
  startDate: Date;

  @ApiProperty({ description: 'Call end date', example: '2024-12-31' })
  @Prop({ required: true })
  endDate: Date;

  @ApiProperty({
    description: 'Call status',
    enum: CallStatus,
    example: CallStatus.DRAFT,
  })
  @Prop({ required: true, enum: CallStatus, default: CallStatus.DRAFT })
  status: CallStatus;

  @ApiProperty({
    description: 'Form fields configuration',
    type: [FormField],
    required: false,
  })
  @Prop({ type: [FormFieldSchema], default: [] })
  form: FormField[];

  @ApiProperty({ description: 'Soft delete timestamp', required: false })
  @Prop()
  deletedAt?: Date;
}

export const CallSchema = SchemaFactory.createForClass(Call);

CallSchema.index({ deletedAt: 1 });
CallSchema.index({ area: 1 });
