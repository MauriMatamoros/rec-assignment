import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './models/booking.model';
import { UsersModule } from '../users/users.module';
import { RestaurantTablesModule } from '../restaurant-tables/restaurant-tables.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Booking]),
    UsersModule,
    RestaurantTablesModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
