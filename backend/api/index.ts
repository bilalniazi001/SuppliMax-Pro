import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';

const server = express();

export const createServer = async (expressInstance: any) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  // Security
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  
  app.use(compression());

  // Improved CORS for Vercel
  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(u => u.trim())
    : null;

  app.enableCors({
    origin: allowedOrigins || ((origin, callback) => callback(null, true)),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });

  await app.init();
  return app;
};

// Vercel serverless handler pattern
export default async (req: any, res: any) => {
  await createServer(server);
  return server(req, res);
};
