import {
  Table,
  Column,
  Model,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { RestaurantTable } from '../../restaurant-tables/models/restaurant-table.model';
import { DietaryRestriction } from '../../dietary-restrictions/models/dietary-restrictions.model';
import { Endorsement } from '../../endorsements/models/endorsement.model';

@Table
export class Restaurant extends Model {
  @Column
  name: string;

  @HasMany(() => RestaurantTable, { onDelete: 'CASCADE' })
  tables: RestaurantTable[];

  @BelongsToMany(() => DietaryRestriction, () => Endorsement)
  endorsements: DietaryRestriction[];
}
