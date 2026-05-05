import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';

export const DRIZZLE = 'DRIZZLE';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not defined in environment variables');
        }

        console.log('📡 [DATABASE] Connecting to TiDB Cloud...');
        
        const pool = mysql.createPool({
          uri: databaseUrl,
          ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true
          },
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          enableKeepAlive: true,
          keepAliveInitialDelay: 0
        });

        const db = drizzle(pool, { mode: 'default', schema });
        console.log('✅ [DATABASE] Drizzle initialized with MySQL2 pool');
        return db;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}
