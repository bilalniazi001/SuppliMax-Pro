import { 
  Controller, 
  Get, 
  Post, 
  Put, //  ADDED
  Body, 
  Patch, 
  Param, 
  Delete, 
  UsePipes, 
  ValidationPipe,
  HttpException,
  HttpStatus,
  Query
} from '@nestjs/common';
import { ProductsService } from './products.service'; 
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products') 
export class ProductsController {
  
  constructor(private readonly productsService: ProductsService) {} 
  
  @Post() 
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productsService.create(createProductDto);
    } catch (error) {
      throw new HttpException(
        `Failed to create product: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get() 
  async findAll(@Query() query: any) {
    try {
      const filters: any = {};
      
      if (query.category && query.category !== 'all') {
        filters.category = query.category;
      }
      
      if (query.isFeatured === 'true') {
        filters.isFeatured = true;
      }
      
      if (query.isExclusive === 'true') {
        filters.isExclusive = true;
      }
      
      if (query.onSale === 'true') {
        filters.onSale = true;
      }
      
      if (query.isNewArrival === 'true') {
        filters.isNewArrival = true;
      }

      return await this.productsService.findAll(filters);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch products',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.productsService.findOne(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // ✅ ADDED PUT ENDPOINT
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updatePut(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      return await this.productsService.update(id, updateProductDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Patch(':id') 
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      return await this.productsService.update(id, updateProductDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id') 
  async remove(@Param('id') id: string) {
    try {
      return await this.productsService.remove(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('featured/all')
  async findFeatured() {
    try {
      const featuredProducts = await this.productsService.findFeatured();
      
      if (!featuredProducts || featuredProducts.length === 0) {
        return [];
      }
      
      return featuredProducts;
    } catch (error) {
      console.error('Error in featured endpoint:', error);
      return [];
    }
  }

  @Get('exclusive/all')
  async findExclusive() {
    try {
      const exclusiveProducts = await this.productsService.findExclusive();
      
      if (!exclusiveProducts || exclusiveProducts.length === 0) {
        return [];
      }
      
      return exclusiveProducts;
    } catch (error) {
      console.error('Error in exclusive endpoint:', error);
      return [];
    }
  }
  
  @Get('categories/all')
  async getCategories() {
    try {
      const categories = await this.productsService.getCategoriesWithCount();
      
      if (!categories || categories.length === 0) {
        return [];
      }
      
      return categories;
    } catch (error) {
      console.error('Error in categories endpoint:', error);
      return [];
    }
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    try {
      const decodedCategory = decodeURIComponent(category);
      const products = await this.productsService.findByCategory(decodedCategory);
      
      if (!products || products.length === 0) {
        return [];
      }
      
      return products;
    } catch (error) {
      console.error('Error in category endpoint:', error);
      return [];
    }
  }

  @Post('seed/sample-data')
  async seedSampleData() {
    try {
      const sampleProducts = [
        {
          name: 'Whey Protein Premium',
          price: 59.99,
          cost: 35,
          description: 'High-quality whey protein for muscle recovery and growth. Contains 25g protein per serving.',
          imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500',
          quantityInStock: 50,
          size: '2 lbs',
          rating: 4.8,
          color: 'Chocolate',
          onSale: true,
          discountPercentage: 15,
          isNewArrival: false,
          category: 'Protein',
          isInStock: true,
          isFeatured: true,
          isExclusive: false,
        },
        {
          name: 'Pre-Workout Energizer',
          price: 39.99,
          cost: 22,
          description: 'Advanced pre-workout formula for enhanced energy and focus during training sessions.',
          imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0ea3ff8db41?w=500',
          quantityInStock: 75,
          size: '30 servings',
          rating: 4.5,
          color: 'Fruit Punch',
          onSale: false,
          discountPercentage: 0,
          isNewArrival: true,
          category: 'Pre Workout',
          isInStock: true,
          isFeatured: false,
          isExclusive: true,
        }
      ];

      const createdProducts: any[] = [];
      
      for (const productData of sampleProducts) {
        const product = await this.productsService.create(productData as any);
        createdProducts.push(product);
      }

      return {
        message: 'Sample products created successfully',
        count: createdProducts.length,
        products: createdProducts
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create sample data: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}