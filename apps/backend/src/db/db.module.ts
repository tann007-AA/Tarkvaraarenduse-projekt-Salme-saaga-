import { Global, Module } from '@nestjs/common';
import { createPool } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

export const DRIZZLE = Symbol('DRIZZLE');

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
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule { }
