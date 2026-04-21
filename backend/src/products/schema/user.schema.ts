import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 'user' })
  role: string;

  @Prop({ required: false })
  age: number;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  country: string;

  @Prop({ required: false })
  postalCode: string;

  @Prop({ required: false })
  nationality: string;

  @Prop({ required: false })
  cnic: string;
}

export const UserSchema = SchemaFactory.createForClass(User);