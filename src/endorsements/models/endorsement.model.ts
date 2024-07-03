import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Restaurant } from '../../restaurants/models/restaurant.model';
import { DietaryRestriction } from '../../dietary-restrictions/models/dietary-restrictions.model';

@Table
export class Endorsement extends Model {
  @ForeignKey(() => Restaurant)
  @Column
  restaurantId: number;

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant;

  @ForeignKey(() => DietaryRestriction)
  @Column
  dietaryRestrictionId: number;

  @BelongsTo(() => DietaryRestriction)
  dietaryRestriction: DietaryRestriction;
}
