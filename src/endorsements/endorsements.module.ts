import { Module } from '@nestjs/common';
import { EndorsementsService } from './endorsements.service';

@Module({
  providers: [EndorsementsService],
})
export class EndorsementsModule {}
