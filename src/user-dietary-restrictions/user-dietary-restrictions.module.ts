import { Module } from '@nestjs/common';
import { UserDietaryRestrictionsService } from './user-dietary-restrictions.service';
import { DietaryRestrictionsModule } from '../dietary-restrictions/dietary-restrictions.module';

@Module({
  providers: [UserDietaryRestrictionsService],
  imports: [DietaryRestrictionsModule],
})
export class UserDietaryRestrictionsModule {}
