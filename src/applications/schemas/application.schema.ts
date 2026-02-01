/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../enums/application-status.enum';

export type ApplicationDocument = HydratedDocument<Application> & Document;

@Schema({ _id: false })
export class Response {
  @ApiProperty({
    description: 'Response key',
    example: 'por-que-quieres-ser-voluntario-x9k3d',
  })
  @Prop({ required: true })
  id: string;

  @ApiProperty({
    description: 'Response label',
    example: '¿Por qué quieres ser voluntario?',
  })
  @Prop({ required: true })
  label: string;

  @ApiProperty({
    description: 'Response value',
    example: 'Me apasiona ayudar a la comunidad',
  })
  @Prop({ required: true })
  value: string;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);

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
export class Application {
  @ApiProperty({
    description: 'Call reference',
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ type: Types.ObjectId, ref: 'Call', required: true })
  call: Types.ObjectId;

  @ApiProperty({ description: 'Applicant name', example: 'Juan Pérez' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Applicant email', example: 'juan@example.com' })
  @Prop({ required: true })
  email: string;

  @ApiProperty({
    description: 'Application status',
    enum: ApplicationStatus,
    example: ApplicationStatus.REGISTERED,
  })
  @Prop({
    required: true,
    enum: ApplicationStatus,
    default: ApplicationStatus.REGISTERED,
  })
  status: ApplicationStatus;

  @ApiProperty({
    description: 'Form responses',
    type: [Response],
  })
  @Prop([{ type: ResponseSchema }])
  responses: Response[];

  @ApiProperty({ description: 'Whether email was sent', example: false })
  @Prop({ default: false })
  emailSent: boolean;

  @ApiProperty({ description: 'Soft delete timestamp', required: false })
  @Prop()
  deletedAt?: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

ApplicationSchema.index({ call: 1 });
ApplicationSchema.index({ email: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ deletedAt: 1 });
