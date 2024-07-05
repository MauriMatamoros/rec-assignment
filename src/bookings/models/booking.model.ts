import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Guest } from '../../guests/models/guest.model';
import { RestaurantTable } from '../../restaurant-tables/models/restaurant-table.model';

@Table
export class Booking extends Model {
  @Column(DataType.DATE)
  startDate: Date;

  @Column(DataType.DATE)
  endDate: Date;

  @BelongsToMany(() => User, () => Guest)
  guests: User[];

  @ForeignKey(() => RestaurantTable)
  @Column
  tableId: number;

  @BelongsTo(() => RestaurantTable)
  table: RestaurantTable;
}
