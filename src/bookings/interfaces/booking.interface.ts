import { GuestInterface } from './guest.interface';
import { TableInterface } from './table.interface';
import { RestaurantInterface } from './restaurant.interface';

export interface BookingInterface {
  id: number;
  startDate: string;
  endDate: string;
  guests: GuestInterface[];
  table: TableInterface;
  restaurant: RestaurantInterface;
}
