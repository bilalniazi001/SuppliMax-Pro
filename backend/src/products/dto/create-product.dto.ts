import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  imageUrl: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsNumber()
  @Min(0)
  quantityInStock: number;

  @IsOptional()
  @IsString()
  size: string;

  @IsOptional()
  @IsString()
  color: string;

  @IsBoolean()
  onSale: boolean;

  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;

  @IsBoolean()
  isNewArrival: boolean;

  @IsBoolean()
  isInStock: boolean;

  @IsBoolean()
  isFeatured: boolean;

  @IsBoolean()
  isExclusive: boolean;
}