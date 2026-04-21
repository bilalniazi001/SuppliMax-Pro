// src/products/dto/update-product.dto.ts (No change needed, sirf verify karen)
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}