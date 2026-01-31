/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PermissionDocument = Permission & Document;

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
export class Permission {
  @ApiProperty({ description: 'Module name', example: 'users' })
  @Prop({ required: true })
  module: string;

  @ApiProperty({
    description: 'Actions allowed',
    example: ['read', 'write'],
    type: [String],
  })
  @Prop({ type: [String], required: true })
  actions: string[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.index({ module: 1 }, { unique: true });
