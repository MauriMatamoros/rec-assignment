import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Booking } from '../../bookings/models/booking.model';
import { User } from '../../users/models/user.model';

@Table
export class Guest extends Model {
  @ForeignKey(() => Booking)
  @Column
  bookingId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
