import {
  Table,
  Column,
  Model,
  BelongsToMany,
  Unique,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { UserDietaryRestrictions } from '../../user-dietary-restrictions/models/user-dietary-restrictions.model';
import { Restaurant } from '../../restaurants/models/restaurant.model';
import { Endorsement } from '../../endorsements/models/endorsement.model';

@Table
export class DietaryRestriction extends Model {
  @Unique
  @Column
  name: string;

  @BelongsToMany(() => User, () => UserDietaryRestrictions)
  users: User[];

  @BelongsToMany(() => Restaurant, () => Endorsement)
  restaurants: Restaurant[];
}
