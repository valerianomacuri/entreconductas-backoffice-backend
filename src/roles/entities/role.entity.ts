/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RoleDocument = Role & Document;

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
export class Role {
  @ApiProperty({ description: 'Role name', example: 'admin' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Administrator with all modules',
  })
  @Prop()
  description: string;

  @ApiProperty({
    type: [Object],
    description: 'AppModules associated with this role',
  })
  @Prop([{ type: Types.ObjectId, ref: 'AppModule' }])
  modules: Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.index({ name: 1 }, { unique: true });
