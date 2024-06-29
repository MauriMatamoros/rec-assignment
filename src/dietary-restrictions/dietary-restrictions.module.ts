import { Module } from '@nestjs/common';
import { DietaryRestrictionsService } from './dietary-restrictions.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DietaryRestriction } from './models/dietary-restrictions.model';

@Module({
  imports: [SequelizeModule.forFeature([DietaryRestriction])],
  providers: [DietaryRestrictionsService],
  exports: [DietaryRestrictionsService],
})
export class DietaryRestrictionsModule {}
