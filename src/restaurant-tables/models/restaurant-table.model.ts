import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Restaurant } from '../../restaurants/models/restaurant.model';

@Table
export class RestaurantTable extends Model {
  @Column
  capacity: number;

  @ForeignKey(() => Restaurant)
  @Column
  restaurantId: number;

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant;
}
