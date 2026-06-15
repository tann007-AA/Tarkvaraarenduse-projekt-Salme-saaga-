import { Global, Module } from '@nestjs/common';
import { createPool } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { DbService } from './db.service';
import { DRIZZLE } from './db.constants';

const dbProvider = {
  provide: DRIZZLE,
  useFactory: async () => {
    const pool = createPool({
      uri: process.env.DATABASE_URL,
      connectionLimit: 10,
    });

    return drizzle(pool);
  },
};

@Global()
@Module({
  providers: [dbProvider, DbService],
  exports: [dbProvider, DbService],
})
export class DbModule { }
