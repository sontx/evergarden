import { Module } from '@nestjs/common';
import { TrackerController } from './tracker.controller';

@Module({
  providers: [],
  controllers: [TrackerController]
})
export class TrackerModule {}
