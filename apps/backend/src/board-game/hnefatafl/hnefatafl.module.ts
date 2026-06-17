import { Module } from '@nestjs/common';
import { HnefataflEngine } from './hnefatafl.engine';

@Module({
  providers: [HnefataflEngine],
  exports: [HnefataflEngine],
})
export class HnefataflModule {}
