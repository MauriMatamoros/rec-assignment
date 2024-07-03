import { Module } from '@nestjs/common';
import { DietaryRestrictionsService } from './dietary-restrictions.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DietaryRestriction } from './models/dietary-restrictions.model';
import { DietaryRestrictionsController } from './dietary-restrictions.controller';

@Module({
  imports: [SequelizeModule.forFeature([DietaryRestriction])],
  providers: [DietaryRestrictionsService],
  exports: [DietaryRestrictionsService],
  controllers: [DietaryRestrictionsController],
})
export class DietaryRestrictionsModule {}
