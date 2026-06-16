import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from './db.constants';
import type { MySql2Database } from 'drizzle-orm/mysql2';

@Injectable()
export class DbService {
  constructor(@Inject(DRIZZLE) public db: MySql2Database) {}
}
