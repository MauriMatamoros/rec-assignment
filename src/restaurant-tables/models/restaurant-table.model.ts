import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Restaurant } from '../../restaurants/models/restaurant.model';
import { Booking } from '../../bookings/models/booking.model';

@Table
export class RestaurantTable extends Model {
  @Column
  capacity: number;

  @ForeignKey(() => Restaurant)
  @Column
  restaurantId: number;

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant;

  @HasMany(() => Booking, { onDelete: 'CASCADE' })
  bookings: Booking[];
}
