import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { DietaryRestrictionsModule } from './dietary-restrictions/dietary-restrictions.module';
import { UserDietaryRestrictionsModule } from './user-dietary-restrictions/user-dietary-restrictions.module';
import { User } from './users/models/user.model';
import { DietaryRestriction } from './dietary-restrictions/models/dietary-restrictions.model';
import { UserDietaryRestrictions } from './user-dietary-restrictions/models/user-dietary-restrictions.model';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RestaurantTablesModule } from './restaurant-tables/restaurant-tables.module';
import { EndorsementsModule } from './endorsements/endorsements.module';
import { RestaurantTable } from './restaurant-tables/models/restaurant-table.model';
import { Restaurant } from './restaurants/models/restaurant.model';
import { Endorsement } from './endorsements/models/endorsement.model';
import { BookingsModule } from './bookings/bookings.module';
import { GuestsModule } from './guests/guests.module';
import { Booking } from './bookings/models/booking.model';
import { Guest } from './guests/models/guest.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      models: [
        User,
        DietaryRestriction,
        UserDietaryRestrictions,
        RestaurantTable,
        Restaurant,
        Endorsement,
        Booking,
        Guest,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    DietaryRestrictionsModule,
    UserDietaryRestrictionsModule,
    RestaurantsModule,
    RestaurantTablesModule,
    EndorsementsModule,
    BookingsModule,
    GuestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
