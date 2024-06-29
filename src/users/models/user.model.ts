import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { DietaryRestriction } from '../../dietary-restrictions/models/dietary-restrictions.model';
import { UserDietaryRestrictions } from '../../user-dietary-restrictions/models/user-dietary-restrictions.model';

@Table
export class User extends Model {
  @Column
  name: string;

  @BelongsToMany(() => DietaryRestriction, () => UserDietaryRestrictions)
  dietaryRestrictions: DietaryRestriction[];
}
