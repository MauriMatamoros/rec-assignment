import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { DietaryRestriction } from '../../dietary-restrictions/models/dietary-restrictions.model';

@Table
export class UserDietaryRestrictions extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => DietaryRestriction)
  @Column
  dietaryRestrictionId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => DietaryRestriction)
  dietaryRestriction: DietaryRestriction;
}
