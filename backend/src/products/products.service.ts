import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/db.module';
import * as schema from '../db/schema';
import { eq, sql, and, ilike } from 'drizzle-orm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      console.log('🔄 [BACKEND] Creating product with data:', createProductDto);
      
      const id = Math.random().toString(36).substr(2, 9);
      const productData = {
        ...createProductDto,
        id: id,
        isInStock: createProductDto.quantityInStock > 0,
      };

      console.log('✅ [BACKEND] Product data with generated ID:', productData);
      
      const [newProduct] = await this.db.insert(schema.products).values(productData).returning();
      
      console.log('✅ [BACKEND] Product created successfully:', newProduct.name);
      return newProduct;
    } catch (error) {
      console.error('❌ [BACKEND] Error creating product:', error);
      throw new BadRequestException(`Failed to create product: ${error.message}`);
    }
  }

  async findAll(filters?: any) {
    try {
      console.log('🔄 [BACKEND] Fetching all products with filters:', filters);
      
      let query = this.db.select().from(schema.products);
      
      if (filters && Object.keys(filters).length > 0) {
        // Simple filter implementation
        const conditions: any[] = [];
        if (filters.category) conditions.push(eq(schema.products.category, filters.category));
        if (filters.isFeatured !== undefined) conditions.push(eq(schema.products.isFeatured, filters.isFeatured));
        if (filters.isExclusive !== undefined) conditions.push(eq(schema.products.isExclusive, filters.isExclusive));
        
        if (conditions.length > 0) {
          // @ts-ignore
          query = query.where(and(...conditions));
        }
      }
      
      const products = await query;
      console.log(`✅ [BACKEND] Found ${products.length} products`);
      return products;
    } catch (error) {
      console.error('❌ [BACKEND] Error fetching all products:', error);
      throw new BadRequestException('Failed to fetch products');
    }
  }

  async findOne(id: string) {
    try {
      console.log('🔍 [BACKEND] Finding product with ID:', id);
      
      if (!id || id === 'undefined') {
        throw new BadRequestException('Product ID is required');
      }

      const [product] = await this.db.select().from(schema.products).where(eq(schema.products.id, id)).limit(1);
      
      if (!product) {
        console.log('❌ [BACKEND] Product not found with ID:', id);
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      
      return product;
    } catch (error) {
      console.error('❌ [BACKEND] Error finding product:', error);
      throw error;
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      console.log('🔄 [BACKEND] Updating product with ID:', id);
      
      if (!id || id === 'undefined') {
        throw new BadRequestException('Product ID is required');
      }

      const [updatedProduct] = await this.db
        .update(schema.products)
        .set(updateProductDto)
        .where(eq(schema.products.id, id))
        .returning();

      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      
      return updatedProduct;
    } catch (error) {
      console.error('❌ [BACKEND] Error updating product:', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      console.log('🗑️ [BACKEND] Deleting product with ID:', id);
      
      if (!id || id === 'undefined') {
        throw new BadRequestException('Product ID is required');
      }

      const result = await this.db.delete(schema.products).where(eq(schema.products.id, id)).returning();

      if (result.length === 0) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      
      console.log('✅ [BACKEND] Product deleted successfully');
    } catch (error) {
      console.error('❌ [BACKEND] Error deleting product:', error);
      throw error;
    }
  }

  async findFeatured() {
    try {
      return await this.db.select().from(schema.products).where(eq(schema.products.isFeatured, true)).limit(8);
    } catch (error) {
      console.error('❌ [BACKEND] Error fetching featured products:', error);
      return [];
    }
  }

  async findExclusive() {
    try {
      return await this.db.select().from(schema.products).where(eq(schema.products.isExclusive, true)).limit(3);
    } catch (error) {
      console.error('❌ [BACKEND] Error fetching exclusive products:', error);
      return [];
    }
  }

  async getCategoriesWithCount() {
    try {
      console.log('📂 [BACKEND] Fetching categories from database...');
      const results = await this.db.select({
        id: schema.products.category,
        name: schema.products.category,
        productCount: sql<number>`count(*)`,
        imageSrc: sql<string>`max(${schema.products.imageUrl})`,
      })
      .from(schema.products)
      .groupBy(schema.products.category);

      return results.map(r => ({
        ...r,
        href: `/shop/${r.id}`
      }));
    } catch (error) {
      console.error('❌ [BACKEND] Error fetching categories:', error);
      return [];
    }
  }

  async findByCategory(category: string) {
    try {
      return await this.db.select().from(schema.products).where(ilike(schema.products.category, category));
    } catch (error) {
      console.error('❌ [BACKEND] Error fetching category products:', error);
      return [];
    }
  }

  async getDatabaseStats() {
    try {
      const [{ count: totalProducts }] = await this.db.select({ count: sql<number>`count(*)` }).from(schema.products);
      const [{ count: featuredCount }] = await this.db.select({ count: sql<number>`count(*)` }).from(schema.products).where(eq(schema.products.isFeatured, true));
      const [{ count: exclusiveCount }] = await this.db.select({ count: sql<number>`count(*)` }).from(schema.products).where(eq(schema.products.isExclusive, true));
      
      return {
        totalProducts,
        featuredCount,
        exclusiveCount,
        status: 'healthy'
      };
    } catch (error) {
      console.error('❌ [BACKEND] Error getting database stats:', error);
      return { status: 'error', error: error.message };
    }
  }
}