import { Module } from '@nestjs/common';
import { RestaurantTablesService } from './restaurant-tables.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RestaurantTable } from './models/restaurant-table.model';
import { RestaurantTablesController } from './restaurant-tables.controller';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  imports: [SequelizeModule.forFeature([RestaurantTable]), RestaurantsModule],
  providers: [RestaurantTablesService],
  controllers: [RestaurantTablesController],
})
export class RestaurantTablesModule {}
