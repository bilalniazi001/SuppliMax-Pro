// src/app.module.ts - UPDATED VERSION
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './products/auth/auth.module';
import { UsersModule } from './products/users/users.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Rate Limiting: 100 requests per 60 seconds per IP
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    // Caching: In-memory cache for 5 minutes by default
    CacheModule.register({
      ttl: 300000, // 5 minutes
      max: 100, // Maximum number of items in cache
      isGlobal: true,
    }),
    
    // Drizzle Database Module
    DbModule,
    
    // Your modules
    ProductsModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    CartModule,
    WishlistModule,
  ],
  controllers: [AppController],
})
export class AppModule {}