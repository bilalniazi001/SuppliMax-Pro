// src/app.module.ts - UPDATED VERSION
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Drizzle Database Module
    DbModule,
    
    // Your modules
    ProductsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}