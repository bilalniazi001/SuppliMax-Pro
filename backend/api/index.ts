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
    contentSecurityPolicy: false, // Disable CSP if it causes issues with Google OAuth
  }));
  
  // Compression
  app.use(compression());

  // CORS
  app.enableCors({
    origin: '*', // Adjust this to your frontend URL in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.init();
  return app;
};

createServer(server);

export default server;
