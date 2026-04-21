// src/products/schema/product.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true }) 
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0, max: 5 })
  rating: number;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  cost: number;

  @Prop({ required: true, min: 0 })
  quantityInStock: number;

  @Prop({ default: 'One Size' })
  size: string;

  @Prop({ default: '' })
  color: string;

  @Prop({ default: false })
  onSale: boolean;

  @Prop({ default: 0, min: 0, max: 100 })
  discountPercentage: number;

  @Prop({ default: false })
  isNewArrival: boolean;

  @Prop({ default: true })
  isInStock: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  isExclusive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);