/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppModuleDocument = AppModule & Document;

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
export class AppModule {
  @Prop({ required: true, unique: true })
  name: string;
}

export const AppModuleSchema = SchemaFactory.createForClass(AppModule);
