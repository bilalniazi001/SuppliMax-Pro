import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  
  @Get()
  getHello() {
    return { 
      message: 'Supplimax Backend API',
      status: 'OK',
      timestamp: new Date().toISOString(),
      endpoints: {
        // ❌ Yeh line remove karein (kya matlab products yahan show hoga)
        // products: '/products',
        
        // ✅ Correct endpoints add karein
        allProducts: '/products',
        featuredProducts: '/products/featured/all',
        categories: '/products/categories/all',
        health: '/health'
      }
    };
  }

  // ❌❌❌ YEH COMPLETE METHOD REMOVE KAR DEIN ❌❌❌
  // @Get('products')
  // getTestProducts() {
  //   return {
  //     message: 'Test Products API',
  //     data: [
  //       { id: 1, name: 'Whey Protein Premium', price: 59.99, category: 'Protein' },
  //       { id: 2, name: 'Pre-Workout Energizer', price: 39.99, category: 'Pre Workout' },
  //       { id: 3, name: 'BCAA Recovery', price: 29.99, category: 'Recovery' }
  //     ],
  //     database: 'checking_connection',
  //     timestamp: new Date().toISOString()
  //   };
  // }

  @Get('health')
  healthCheck() {
    return {
      status: 'healthy',
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString()
    };
  }
}