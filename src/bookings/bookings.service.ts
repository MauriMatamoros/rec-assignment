import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './models/booking.model';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes, Transaction } from 'sequelize';
import { UsersService } from '../users/users.service';
import { RestaurantTablesService } from '../restaurant-tables/restaurant-tables.service';
import { User } from '../users/models/user.model';
import { RawBookingInterface } from './interfaces/raw-booking.interface';
import { BookingInterface } from './interfaces/booking.interface';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking) private bookingModel: typeof Booking,
    private usersService: UsersService,
    private restaurantTablesService: RestaurantTablesService,
  ) {}

  private readonly selectBooking: string = `
        SELECT 
            "B".id as id, "B"."startDate" as "startDate", "B"."endDate" as "endDate", "B"."tableId" as "tableId",
            "U".id as "userId", "U".name as "userName",
            "RT".capacity as "tableCapacity",
            "R".id as "restaurantId", "R".name as "restaurantName"
        FROM "Bookings" as "B"
        JOIN "Guests"  as "G"
            ON "B".id = "G"."bookingId" 
        JOIN "RestaurantTables" as "RT"
            ON "B"."tableId" = "RT".id 
        JOIN "Restaurants" as "R"
            ON "RT"."restaurantId" = "R".id
        JOIN "Users" as "U"
            ON "U".id = "G"."userId"
  `;

  parseBooking(rows: NonNullable<unknown>[]): NonNullable<unknown> {
    return rows.reduce(
      (
        acc,
        {
          id,
          startDate,
          endDate,
          tableId,
          tableCapacity,
          userId,
          userName,
          restaurantId,
          restaurantName,
        }: RawBookingInterface,
      ) => {
        if (!acc.hasOwnProperty(id)) {
          acc[id] = {
            id,
            startDate,
            endDate,
            guests: [],
            table: {
              tableId,
              tableCapacity,
            },
            restaurant: {
              restaurantId,
              restaurantName,
            },
          };
        }
        acc[id].guests.push({ userId, userName });
        return acc;
      },
      {},
    );
  }

  async create(createBookingDto: CreateBookingDto): Promise<BookingInterface> {
    const { startDate, guests, restaurantTableId } = createBookingDto;

    const endDate = new Date(
      new Date(startDate).getTime() + 2 * 60 * 60 * 1000,
    );

    const users: User[] = [];

    for (const id of guests) {
      const user = await this.usersService.findOne(id);
      users.push(user);
    }

    const restaurantTable =
      await this.restaurantTablesService.findOne(restaurantTableId);

    let transaction: Transaction;

    const sequelizeInstance = this.bookingModel.sequelize;

    try {
      transaction = await Booking.sequelize.transaction();

      const overlappingUserBookings = await sequelizeInstance.query(
        `
                SELECT * 
                FROM "Guests" 
                JOIN "Bookings" 
                    ON "Guests"."bookingId" = "Bookings".id
                WHERE 
                ("Bookings"."startDate" < :endDate AND "Bookings"."endDate" > :startDate)
                AND "Guests"."userId" IN (:guests)
            `,
        {
          replacements: {
            startDate,
            endDate,
            guests: users.map(({ id }) => id),
          },
          type: QueryTypes.SELECT,
          transaction,
        },
      );

      if (overlappingUserBookings && overlappingUserBookings.length > 0) {
        const overlappingUsers = overlappingUserBookings.map(
          (booking: { userId: number }) => booking.userId,
        );

        throw new HttpException(
          `Overlapping booking found for user(s) with id(s): ${overlappingUsers.join(', ')}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const overlappingTableBookings = await sequelizeInstance.query(
        `
                SELECT * 
                FROM "Bookings" 
                WHERE 
                ("startDate" < :endDate AND "endDate" > :startDate)
                AND "tableId" = :tableId
            `,
        {
          replacements: {
            startDate,
            endDate,
            tableId: restaurantTable.id,
          },
          type: QueryTypes.SELECT,
          transaction,
        },
      );

      if (overlappingTableBookings && overlappingTableBookings.length > 0) {
        throw new HttpException(
          `Overlapping booking found for table: ${restaurantTable.id}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const booking = await Booking.create(
        { startDate, endDate, tableId: restaurantTable.id },
        { transaction },
      );

      for (const user of users) {
        await booking.$add('guests', user, { transaction });
      }

      await transaction.commit();

      return this.findOne(booking.id);
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  async findAll(): Promise<BookingInterface[]> {
    const rows = await this.bookingModel.sequelize.query(
      `
        ${this.selectBooking}
    `,
      {
        type: QueryTypes.SELECT,
      },
    );

    const parsedBooking = this.parseBooking(rows);

    return Object.values(parsedBooking) as unknown as BookingInterface[];
  }

  async findOne(id: number): Promise<BookingInterface> {
    const rows = await this.bookingModel.sequelize.query(
      `
        ${this.selectBooking}
        WHERE "B".id = :id
    `,
      {
        replacements: {
          id,
        },
        type: QueryTypes.SELECT,
      },
    );

    if (rows.length === 0) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    const parsedBooking = this.parseBooking(rows);

    return Object.values(parsedBooking)[0] as unknown as BookingInterface;
  }

  async remove(id: number): Promise<BookingInterface> {
    const booking = await this.findOne(id);

    await this.bookingModel.destroy({ where: { id } });

    return booking;
  }
}
