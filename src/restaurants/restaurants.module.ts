import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Restaurant } from './models/restaurant.model';
import { DietaryRestrictionsModule } from '../dietary-restrictions/dietary-restrictions.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Restaurant]),
    DietaryRestrictionsModule,
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
