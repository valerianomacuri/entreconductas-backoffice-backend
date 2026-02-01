/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AreaDocument = HydratedDocument<Area> & Document;

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
export class Area {
  @ApiProperty({ description: 'Area name', example: 'Technology' })
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @ApiProperty({
    description: 'Area description',
    required: false,
    example: 'Technology related calls',
  })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'Area active status', example: true })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Soft delete timestamp', required: false })
  @Prop()
  deletedAt?: Date;
}

export const AreaSchema = SchemaFactory.createForClass(Area);

AreaSchema.index({ name: 1 }, { unique: true });
AreaSchema.index({ deletedAt: 1 });
