/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../permissions/entities/permission.entity';

export type RoleDocument = Role & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_, ret: any) => {
      ret.id = ret._id;
      delete ret._id;

      if (ret.permissions && ret.permissions.length > 0) {
        ret.permissions = ret.permissions.map((p: any) => {
          if (p && p._id) {
            return {
              id: p._id?.toString() || p.id,
              module: p.module,
              actions: p.actions,
            };
          }
          return p;
        });
      }
    },
  },
})
export class Role {
  @ApiProperty({ description: 'Role name', example: 'admin' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Administrator with all permissions',
  })
  @Prop()
  description: string;

  @ApiProperty({
    type: [Object],
    description: 'Permissions associated with this role',
  })
  @Prop({
    type: [{ type: Types.ObjectId, ref: Permission.name }],
    default: [],
  })
  permissions: Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.index({ name: 1 }, { unique: true });
