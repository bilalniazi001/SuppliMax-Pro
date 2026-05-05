import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Set to true if you don't use external scripts/fonts
  }));
  
  // Compression for faster responses
  app.use(compression());

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS Configuration
  app.enableCors({
    origin: '*', // In production, replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
  });
  
  const port = process.env.PORT || 8080;
  
  await app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🛡️  Security: Helmet & Throttler enabled`);
    console.log(`⚡ Optimization: Compression & Caching enabled`);
  });
}
bootstrap();