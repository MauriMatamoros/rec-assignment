import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Restaurant } from './models/restaurant.model';
import { DietaryRestrictionsService } from '../dietary-restrictions/dietary-restrictions.service';
import { DietaryRestriction } from '../dietary-restrictions/models/dietary-restrictions.model';
import { RestaurantTable } from '../restaurant-tables/models/restaurant-table.model';
import { RestaurantFilterDto } from './dto/filter-restaurant.dto';
import { QueryTypes } from 'sequelize';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant)
    private restaurantModel: typeof Restaurant,
    private dietaryRestrictionService: DietaryRestrictionsService,
  ) {}

  private includeEndorsements = {
    model: DietaryRestriction,
    as: 'endorsements',
    through: { attributes: [] },
  };

  private includeTables = {
    model: RestaurantTable,
    as: 'tables',
    required: false,
  };

  private readonly availableRestaurants = `
    SELECT DISTINCT "Restaurants".*
    FROM "Restaurants"
    JOIN "RestaurantTables" ON "Restaurants"."id" = "RestaurantTables"."restaurantId"
    WHERE "Restaurants"."id" IN (
        SELECT DISTINCT "RestaurantTables"."restaurantId"
        FROM "RestaurantTables"
        WHERE 
            "RestaurantTables"."capacity" >= :people
            AND "RestaurantTables"."id" NOT IN (
                SELECT "Bookings"."tableId"
                FROM "Bookings"
                WHERE 
                (
                    "Bookings"."startDate" <= :time AND :time < "Bookings"."endDate"
                    OR
                    "Bookings"."startDate" < :twoHoursLater AND :twoHoursLater <= "Bookings"."endDate"
                )
            )
        ) AND "Restaurants"."id" IN (
            SELECT "Endorsements"."restaurantId"
            FROM "Endorsements"
            WHERE "Endorsements"."dietaryRestrictionId" IN (
                SELECT "UserDietaryRestrictions"."dietaryRestrictionId"
                FROM "UserDietaryRestrictions"
                WHERE "UserDietaryRestrictions"."userId" IN (:users)
            )
        );
`;

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.create({
      name: createRestaurantDto.name,
    });

    if (createRestaurantDto.endorsements) {
      for (const endorsement of createRestaurantDto.endorsements) {
        const restriction =
          await this.dietaryRestrictionService.findOrCreate(endorsement);

        await restaurant.$add('endorsement', restriction);
      }
    }

    return this.findOne(restaurant.id);
  }

  findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.findAll({
      include: [this.includeEndorsements, this.includeTables],
    });
  }

  async findAvailable(filters: RestaurantFilterDto): Promise<Restaurant[]> {
    const { date } = filters;
    const users = filters?.user ? [filters.user] : filters.users;
    const time = new Date(date);
    const twoHoursLater = new Date(time.getTime() + 2 * 60 * 60 * 10000);

    console.log(users);

    const replacements = { people: users.length, users, time, twoHoursLater };

    const restaurants = await this.restaurantModel.sequelize.query(
      this.availableRestaurants,
      { replacements, type: QueryTypes.SELECT },
    );

    const uniqueRestaurants = restaurants.filter(
      (restaurant: Restaurant, index, arr) => {
        return (
          index ===
          arr.findIndex((rest: Restaurant) => rest.id === restaurant.id)
        );
      },
    );

    return uniqueRestaurants as unknown as Promise<Restaurant[]>;
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findOne({
      where: { id },
      include: [this.includeEndorsements, this.includeTables],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    return restaurant;
  }

  async update(
    id: number,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    if (updateRestaurantDto.name !== restaurant.name) {
      await restaurant.update({ name: updateRestaurantDto.name });
    }

    if (updateRestaurantDto.endorsements !== undefined) {
      const newEndorsements = await Promise.all(
        updateRestaurantDto.endorsements.map((restriction) =>
          this.dietaryRestrictionService.findOrCreate(restriction),
        ),
      );

      await restaurant.$set('endorsements', newEndorsements);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    await this.restaurantModel.destroy({ where: { id: restaurant.id } });

    return restaurant;
  }
}
